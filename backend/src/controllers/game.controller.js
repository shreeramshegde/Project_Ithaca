const pool = require('../config/database');

const getState = async (req, res) => {
  const teamId = req.team.id;
  try {
    const teamRes = await pool.query('SELECT remaining_years, current_island, standard_hints_left, is_completed FROM teams WHERE id = $1', [teamId]);
    const inventoryRes = await pool.query('SELECT * FROM team_inventory WHERE team_id = $1 AND is_used = false', [teamId]);
    
    return res.status(200).json({
      status: 'success',
      data: {
        team: teamRes.rows[0],
        inventory: inventoryRes.rows
      }
    });
  } catch (err) {
    console.error('Error in getState:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getQuestions = async (req, res) => {
  const teamId = req.team.id;
  try {
    const teamRes = await pool.query('SELECT current_island FROM teams WHERE id = $1', [teamId]);
    const currentIsland = teamRes.rows[0].current_island;

    const qRes = await pool.query(
      `SELECT q.id, q.type, q.format, q.question_text, q.options, q.reward_years, q.penalty_years, q.difficulty_level, q.sequence_number, 
       (SELECT status FROM team_progress tp WHERE tp.question_id = q.id AND tp.team_id = $1 ORDER BY attempted_at DESC LIMIT 1) as progress_status 
       FROM questions q
       WHERE q.island_id = $2 
       ORDER BY q.type DESC, q.sequence_number ASC`,
      [teamId, currentIsland]
    );

    return res.status(200).json({
      status: 'success',
      data: {
        island: currentIsland,
        questions: qRes.rows
      }
    });
  } catch (err) {
    console.error('Error in getQuestions:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getRewardForIsland = (island_id) => {
  switch (island_id) {
    case 1: return 'ATHENAS_SCROLL';
    case 2: return 'CYCLOPS_EYE';
    case 3: return 'HERMES_SANDALS';
    case 4: return 'THE_BLESSING';
    default: return 'UNKNOWN';
  }
};

const getIslandForReward = (reward_type) => {
  switch (reward_type) {
    case 'ATHENAS_SCROLL': return 1;
    case 'CYCLOPS_EYE': return 2;
    case 'HERMES_SANDALS': return 3;
    case 'THE_BLESSING': return 4;
    default: return 0;
  }
};

const submitPreRound = async (req, res) => {
  const teamId = req.team.id;
  const { question_id, selected_option } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get question
    const qRes = await client.query('SELECT * FROM questions WHERE id = $1 AND type = $2', [question_id, 'PRE_ROUND']);
    if (qRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'error', message: 'Pre-round question not found' });
    }
    const question = qRes.rows[0];

    // Check if already answered correctly
    const progressRes = await client.query(
      'SELECT * FROM team_progress WHERE team_id = $1 AND question_id = $2 AND status = $3', 
      [teamId, question_id, 'CORRECT']
    );
    if (progressRes.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ status: 'error', message: 'Pre-round already completed' });
    }

    const normalizeString = (str) => {
      return str ? str.replace(/[^a-zA-Z0-9]/g, '').trim().toLowerCase() : '';
    };

    const isMatch = (input, expected) => {
      const normIn = normalizeString(input);
      const normExp = normalizeString(expected);
      if (normIn === normExp) return true;

      if (normExp === 'hope' && normIn === 'hope') return true;
      if (normExp === '3' && (normIn === '3' || normIn === '3steps' || normIn === 'three')) return true;
      if (normExp === '4' && (normIn === '4' || normIn === '4khz' || normIn === 'four')) return true;
      if (normExp === '8' && (normIn === '8' || normIn === '8days' || normIn === 'eight')) return true;

      return false;
    };

    const isCorrect = isMatch(selected_option, question.correct_answer);
    const isHiddenWrong = (question.hidden_wrong_answer && isMatch(selected_option, question.hidden_wrong_answer));

    if (isCorrect) {
      const rewardType = getRewardForIsland(question.island_id);
      await client.query('INSERT INTO team_inventory (team_id, reward_type) VALUES ($1, $2)', [teamId, rewardType]);
      await client.query('INSERT INTO team_progress (team_id, question_id, status) VALUES ($1, $2, $3)', [teamId, question_id, 'CORRECT']);
      
      await client.query('COMMIT');
      return res.status(200).json({ status: 'success', message: `Correct! You earned ${rewardType}.`, is_correct: true, reward: rewardType });
    } else {
      let penaltyMessage = 'Incorrect answer.';
      if (isHiddenWrong) {
        await client.query('UPDATE teams SET remaining_years = remaining_years + 2 WHERE id = $1', [teamId]);
        penaltyMessage = 'Hidden trap triggered! +2 years penalty applied.';
      }
      await client.query('INSERT INTO team_progress (team_id, question_id, status) VALUES ($1, $2, $3)', [teamId, question_id, 'INCORRECT']);
      await client.query('COMMIT');
      return res.status(200).json({ status: 'success', message: penaltyMessage, is_correct: false });
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in submitPreRound:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  } finally {
    client.release();
  }
};

const submitAnswer = async (req, res) => {
  const teamId = req.team.id;
  const { question_id, answer_string } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get question
    const qRes = await client.query('SELECT * FROM questions WHERE id = $1', [question_id]);
    if (qRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'error', message: 'Question not found' });
    }
    const question = qRes.rows[0];

    // 2. Check if already answered correctly
    const progressRes = await client.query(
      'SELECT * FROM team_progress WHERE team_id = $1 AND question_id = $2 AND status = $3', 
      [teamId, question_id, 'CORRECT']
    );
    if (progressRes.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ status: 'error', message: 'Question already correctly answered' });
    }

    // 2.5 For Islands 2, 3, 4, enforce strict sequential progression
    if (question.island_id > 1) {
      const prevUnattempted = await client.query(
        `SELECT q.id FROM questions q
         WHERE q.island_id = $1 AND q.type = 'MAIN' AND q.sequence_number < $2
         AND NOT EXISTS (
           SELECT 1 FROM team_progress tp 
           WHERE tp.question_id = q.id AND tp.team_id = $3
         )`,
        [question.island_id, question.sequence_number, teamId]
      );
      if (prevUnattempted.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          status: 'error', 
          message: 'Trials on this island must be solved sequentially! Complete the previous stages first.' 
        });
      }
    }

    // 3. Verify answer with smart synonym matching for DSA riddles
    const normalizeString = (str) => {
      return str ? str.replace(/[^a-zA-Z0-9]/g, '').trim().toLowerCase() : '';
    };

    const isMatch = (input, expected) => {
      const normIn = normalizeString(input);
      const normExp = normalizeString(expected);
      if (normIn === normExp) return true;

      // Smart synonyms for CS / DSA riddles and simulations
      if (normExp === 'hope' && normIn === 'hope') return true;
      if (normExp === '3' && (normIn === '3' || normIn === '3steps' || normIn === 'three')) return true;
      if (normExp === '4' && (normIn === '4' || normIn === '4khz' || normIn === 'four')) return true;
      if (normExp === '8' && (normIn === '8' || normIn === '8days' || normIn === 'eight')) return true;
      if (normExp === '6' && (normIn === '6' || normIn === '6moves' || normIn === 'six' || normIn === '6steps')) return true;
      if (normExp === 'abs' && normIn === 'antilockbrakingsystem') return true;
      if (normExp === 'aandd' && (normIn === 'ad' || normIn === 'da' || normIn === 'aandd')) return true;
      if (normExp === 'dabc' && normIn === 'dabc') return true;
      if (normExp === '4khz8cycles' && (normIn === '4khz8cycles' || normIn === '48' || normIn === '4khz8' || normIn === '48cycles')) return true;
      if (normExp === 'negativerail' && (normIn === 'negative' || normIn === 'ground' || normIn === 'gnd' || normIn === 'negativerail')) return true;
      if (normExp === 'logicalerror' && (normIn === 'infiniteloop' || normIn === 'infinitelooperror')) return true;
      if (normExp === '346' && (normIn === '346' || normIn === '346m' || normIn === '3464' || normIn === '35')) return true;
      if (normExp === '655' && (normIn === '655' || normIn === '654' || normIn === '65472')) return true;

      return false;
    };

    const isCorrect = isMatch(answer_string, question.correct_answer);

    const isHiddenWrong = question.hidden_wrong_answer && isMatch(answer_string, question.hidden_wrong_answer);

    let yearsChange = 0;
    let status = '';
    let message = '';

    if (isCorrect) {
      yearsChange = -question.reward_years;
      status = 'CORRECT';
      message = 'Correct answer!';
    } else {
      yearsChange = question.penalty_years;
      status = 'INCORRECT';
      if (isHiddenWrong) {
        yearsChange += 2; // Extra penalty for hidden wrong answer
        message = 'Hidden trap triggered! Extra penalty applied.';
      } else {
        message = 'Incorrect answer. Penalty applied.';
      }
    }

    // 4. Update score (Row-level lock prevents race conditions)
    const updateRes = await client.query(
      'UPDATE teams SET remaining_years = remaining_years + $1 WHERE id = $2 RETURNING remaining_years, current_island',
      [yearsChange, teamId]
    );

    // 5. Log progress
    await client.query(
      'INSERT INTO team_progress (team_id, question_id, status) VALUES ($1, $2, $3)',
      [teamId, question_id, status]
    );

    await client.query('COMMIT');
    
    return res.status(200).json({
      status: 'success',
      message: message,
      is_correct: isCorrect,
      data: updateRes.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error submitting answer:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  } finally {
    client.release();
  }
};

const useHint = async (req, res) => {
  const teamId = req.team.id;
  const { question_id } = req.body; // Need to know which question they want a hint for

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check hints left
    const teamRes = await client.query('SELECT standard_hints_left FROM teams WHERE id = $1 FOR UPDATE', [teamId]);
    if (teamRes.rows[0].standard_hints_left <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ status: 'error', message: 'No standard hints remaining' });
    }

    // Get the question
    const qRes = await client.query('SELECT hint_text, type FROM questions WHERE id = $1', [question_id]);
    if (qRes.rows.length === 0 || !qRes.rows[0].hint_text) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'error', message: 'No hint available for this question' });
    }

    if (qRes.rows[0].type === 'PRE_ROUND') {
      await client.query('ROLLBACK');
      return res.status(400).json({ status: 'error', message: 'Hints cannot be used for Pre-Round questions' });
    }

    // Deduct hint
    await client.query('UPDATE teams SET standard_hints_left = standard_hints_left - 1 WHERE id = $1', [teamId]);
    
    await client.query('COMMIT');
    
    return res.status(200).json({ 
      status: 'success', 
      message: 'Hint activated', 
      hint: qRes.rows[0].hint_text,
      hints_left: teamRes.rows[0].standard_hints_left - 1
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error using hint:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  } finally {
    client.release();
  }
};

const useReward = async (req, res) => {
  const teamId = req.team.id;
  const { reward_type, target_question_id } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Check if they have the reward
    const invRes = await client.query(
      'SELECT id FROM team_inventory WHERE team_id = $1 AND reward_type = $2 AND is_used = false FOR UPDATE',
      [teamId, reward_type]
    );
    if (invRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ status: 'error', message: 'Reward not available or already used' });
    }
    const inventoryId = invRes.rows[0].id;

    // 1.5 Check if the reward is valid for the current island
    const teamRes = await client.query('SELECT current_island FROM teams WHERE id = $1', [teamId]);
    const currentIsland = teamRes.rows[0].current_island;
    const requiredIsland = getIslandForReward(reward_type);
    
    if (currentIsland !== requiredIsland) {
      // Mark it as used/expired implicitly or just reject the request. Rejecting is safer.
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        status: 'error', 
        message: `Rewards expire! ${reward_type} is only valid during Island ${requiredIsland}, but you are on Island ${currentIsland}.` 
      });
    }

    // 2. Fetch target question if provided
    let question = null;
    if (target_question_id) {
      const qRes = await client.query('SELECT * FROM questions WHERE id = $1', [target_question_id]);
      if (qRes.rows.length > 0) question = qRes.rows[0];
    }

    let resultData = {};

    // 3. Apply specific reward effect
    if (reward_type === 'ATHENAS_SCROLL') {
      if (!question) throw new Error("Target trial required for Athena's Scroll. Please select an active trial first.");
      if (!question.hint_text) throw new Error("No Oracle hint available for this trial.");
      
      resultData.hint = question.hint_text;
      resultData.message = `Athena's Scroll reveals: "${question.hint_text}"`;
    } 
    else if (reward_type === 'CYCLOPS_EYE') {
      if (!question || question.format !== 'MCQ') throw new Error('Target MCQ question required for Cyclops Eye');
      const wrongOptions = question.options.filter(opt => opt !== question.correct_answer);
      resultData.eliminated_option = wrongOptions.length > 0 ? wrongOptions[0] : null;
      resultData.message = 'Cyclops Eye eliminates one wrong option!';
    }
    else if (reward_type === 'HERMES_SANDALS' || reward_type === 'THE_BLESSING') {
      const yearsToDeduct = reward_type === 'THE_BLESSING' ? 3 : 2;
      await client.query('UPDATE teams SET remaining_years = remaining_years - $1 WHERE id = $2', [yearsToDeduct, teamId]);
      resultData.message = `${reward_type} applied! Deducted ${yearsToDeduct} years.`;
    }

    // 4. Mark as used
    await client.query('UPDATE team_inventory SET is_used = true WHERE id = $1', [inventoryId]);

    await client.query('COMMIT');
    return res.status(200).json({ status: 'success', ...resultData });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in useReward:', err);
    return res.status(400).json({ status: 'error', message: err.message || 'Internal server error' });
  } finally {
    client.release();
  }
};

const nextIsland = async (req, res) => {
  const teamId = req.team.id;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const teamRes = await client.query('SELECT current_island, is_completed FROM teams WHERE id = $1 FOR UPDATE', [teamId]);
    const team = teamRes.rows[0];
    
    if (team.is_completed) {
      await client.query('ROLLBACK');
      return res.status(400).json({ status: 'error', message: 'Journey is already completed' });
    }
    
    let newIsland = team.current_island + 1;
    let isCompleted = false;
    let endTimeQuery = '';
    
    if (newIsland > 4) {
      newIsland = 4;
      isCompleted = true;
      endTimeQuery = ', end_time = CURRENT_TIMESTAMP, is_completed = true';
    }
    
    const updateQuery = `UPDATE teams SET current_island = $1 ${endTimeQuery} WHERE id = $2 RETURNING current_island, is_completed`;
    const updateRes = await client.query(updateQuery, [newIsland, teamId]);
    
    await client.query('COMMIT');
    
    return res.status(200).json({
      status: 'success',
      message: isCompleted ? 'Congratulations! You have returned to Ithaca.' : `Sailed to Island ${newIsland}`,
      data: updateRes.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in nextIsland:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = {
  getState,
  getQuestions,
  submitPreRound,
  submitAnswer,
  useHint,
  useReward,
  nextIsland
};
