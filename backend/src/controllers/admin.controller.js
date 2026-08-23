const pool = require('../config/database');

const getLeaderboard = async (req, res) => {
  try {
    // Winner & Leaderboard Ranking Hierarchy:
    // 1. is_completed DESC: Teams who reached Ithaca rank highest.
    // 2. current_island DESC: Teams that progressed further through the islands rank higher.
    // 3. solved_questions DESC: Teams that solved more questions rank higher.
    // 4. remaining_years ASC: Teams with the lowest remaining voyage years rank higher.
    // 5. duration_seconds ASC: Teams with shorter elapsed duration rank higher.
    // 6. standard_hints_left DESC: Teams with more unused Oracle hints rank higher.
    const result = await pool.query(`
      SELECT 
        t.id, 
        t.team_name, 
        t.remaining_years, 
        t.current_island, 
        t.standard_hints_left, 
        t.is_completed,
        EXTRACT(EPOCH FROM (COALESCE(t.end_time, CURRENT_TIMESTAMP) - t.start_time)) AS duration_seconds,
        COUNT(tp.id) FILTER (WHERE tp.status = 'CORRECT') AS solved_questions,
        COUNT(tp.id) AS total_attempts,
        ROW_NUMBER() OVER (
          ORDER BY 
            t.is_completed DESC,
            t.current_island DESC,
            COUNT(tp.id) FILTER (WHERE tp.status = 'CORRECT') DESC,
            t.remaining_years ASC,
            EXTRACT(EPOCH FROM (COALESCE(t.end_time, CURRENT_TIMESTAMP) - t.start_time)) ASC,
            t.standard_hints_left DESC
        ) AS rank
      FROM teams t
      LEFT JOIN team_progress tp ON t.id = tp.team_id
      GROUP BY t.id
      ORDER BY rank ASC
    `);
    
    return res.status(200).json({
      status: 'success',
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const adjustYears = async (req, res) => {
  const { team_id, adjustment } = req.body;
  try {
    const result = await pool.query(
      'UPDATE teams SET remaining_years = remaining_years + $1 WHERE id = $2 RETURNING id, team_name, remaining_years',
      [adjustment, team_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Team not found' });
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Score adjusted successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error adjusting score:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getQuestions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions ORDER BY island_id ASC, sequence_number ASC');
    return res.status(200).json({ status: 'success', data: result.rows });
  } catch (err) {
    console.error('Error fetching questions:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const addQuestion = async (req, res) => {
  const { 
    island_id, type, format, question_text, hint_text, 
    options, correct_answer, hidden_wrong_answer, 
    reward_years, penalty_years, difficulty_level, sequence_number
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO questions (
        island_id, type, format, question_text, hint_text, options, 
        correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [island_id, type, format, question_text, hint_text, options ? JSON.stringify(options) : null, 
       correct_answer, hidden_wrong_answer, reward_years, penalty_years, difficulty_level, sequence_number || 0]
    );

    return res.status(201).json({
      status: 'success',
      message: 'Question added successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error adding question:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const freezeGame = async (req, res) => {
  try {
    const { setGameFrozen } = require('../services/gameSettings');
    await setGameFrozen(true);
    
    // Freeze all active teams' end_time so their final durations are locked at this exact instant
    await pool.query('UPDATE teams SET end_time = CURRENT_TIMESTAMP WHERE end_time IS NULL');

    return res.status(200).json({
      status: 'success',
      message: 'All incoming submissions are now closed and frozen. The competition has ended.',
      is_frozen: true
    });
  } catch (err) {
    console.error('Error freezing game:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const unfreezeGame = async (req, res) => {
  try {
    const { setGameFrozen } = require('../services/gameSettings');
    await setGameFrozen(false);

    return res.status(200).json({
      status: 'success',
      message: 'Game submissions reopened successfully.',
      is_frozen: false
    });
  } catch (err) {
    console.error('Error unfreezing game:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getFreezeStatus = async (req, res) => {
  try {
    const { isGameFrozen } = require('../services/gameSettings');
    const frozen = await isGameFrozen();
    return res.status(200).json({
      status: 'success',
      is_frozen: frozen
    });
  } catch (err) {
    console.error('Error fetching freeze status:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = {
  getLeaderboard,
  adjustYears,
  getQuestions,
  addQuestion,
  freezeGame,
  unfreezeGame,
  getFreezeStatus
};
