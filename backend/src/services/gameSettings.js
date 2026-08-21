const pool = require('../config/database');

let cachedIsFrozen = null;
let lastCheck = 0;

const isGameFrozen = async () => {
  const now = Date.now();
  if (cachedIsFrozen !== null && now - lastCheck < 1500) {
    return cachedIsFrozen;
  }
  try {
    const res = await pool.query("SELECT value FROM game_settings WHERE key = 'is_frozen'");
    if (res.rows.length > 0) {
      cachedIsFrozen = res.rows[0].value === 'true';
    } else {
      cachedIsFrozen = false;
    }
    lastCheck = now;
    return cachedIsFrozen;
  } catch (err) {
    console.error('Error checking game frozen state:', err);
    return false;
  }
};

const setGameFrozen = async (frozen) => {
  cachedIsFrozen = frozen;
  lastCheck = Date.now();
  await pool.query(
    `INSERT INTO game_settings (key, value, updated_at) 
     VALUES ('is_frozen', $1, CURRENT_TIMESTAMP) 
     ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP`,
    [frozen ? 'true' : 'false']
  );
  return frozen;
};

module.exports = {
  isGameFrozen,
  setGameFrozen
};
