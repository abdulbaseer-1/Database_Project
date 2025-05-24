import pool from '../database/db.js';

// Controller function to handle SQL queries
export const executeSQLQuery = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'SQL query is required' });
  }

  try {
    const [results] = await pool.query(query);
    res.json({ result: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to execute query' });
  }
};
