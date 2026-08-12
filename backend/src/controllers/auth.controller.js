const pool = require('../config/database');

const registerTeam = async (req, res) => {
  const { team_name, auth_code } = req.body;

  try {
    // Check if team already exists
    const existingTeam = await pool.query(
      'SELECT * FROM teams WHERE team_name = $1 OR auth_code = $2',
      [team_name, auth_code]
    );

    if (existingTeam.rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Team name or Auth code already exists'
      });
    }

    // Insert new team
    const newTeam = await pool.query(
      `INSERT INTO teams (team_name, auth_code) 
       VALUES ($1, $2) 
       RETURNING id, team_name, remaining_years, standard_hints_left, current_island`,
      [team_name, auth_code]
    );

    return res.status(201).json({
      status: 'success',
      message: 'Team registered successfully',
      data: newTeam.rows[0]
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  registerTeam
};
