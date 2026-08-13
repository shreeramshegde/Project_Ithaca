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

const submitPreRound = async (req, res) => {
  // Logic to process GK MCQ, assign items
  return res.status(200).json({ status: 'success', message: 'Pre-round submitted' });
};

const submitAnswer = async (req, res) => {
  // Logic to process answers, apply deductions/penalties using transactions
  return res.status(200).json({ status: 'success', message: 'Answer submitted' });
};

const useHint = async (req, res) => {
  // Logic to decrement standard_hints_left
  return res.status(200).json({ status: 'success', message: 'Hint used', hint: 'Sample hint text' });
};

const useReward = async (req, res) => {
  // Logic to process reward items
  return res.status(200).json({ status: 'success', message: 'Reward used' });
};

module.exports = {
  getState,
  submitPreRound,
  submitAnswer,
  useHint,
  useReward
};
