const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create messages table if not exists
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      character_id INTEGER,
      user_id BIGINT,
      text TEXT,
      is_user BOOLEAN,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
initDB();

// Get messages
app.get('/api/messages/:characterId', async (req, res) => {
  const { characterId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE character_id = $1 ORDER BY created_at ASC',
      [characterId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save message
app.post('/api/messages', async (req, res) => {
  const { characterId, userId, text, isUser } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (character_id, user_id, text, is_user) VALUES ($1, $2, $3, $4) RETURNING *',
      [characterId, userId, text, isUser]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});