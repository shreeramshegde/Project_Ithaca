const pool = require('../config/database');

const getLeaderboard = async (req, res) => {
  try {
    // Rank by lowest remaining years, then shortest duration (if finished), then most hints left
    const result = await pool.query(`
      SELECT 
        id, team_name, remaining_years, current_island, standard_hints_left, is_completed,
        EXTRACT(EPOCH FROM (COALESCE(end_time, CURRENT_TIMESTAMP) - start_time)) AS duration_seconds
      FROM teams 
      ORDER BY 
        remaining_years ASC,
        duration_seconds ASC,
        standard_hints_left DESC
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

module.exports = {
  getLeaderboard,
  adjustYears
};
