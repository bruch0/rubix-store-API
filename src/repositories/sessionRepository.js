import connection from '../database/database.js';

const registerSession = async ({ userId }) => {
  const session = await connection.query(
    'INSERT INTO sessions (user_id) VALUES ($1) RETURNING id;',
    [userId]
  );

  return session.rows[0].id;
};

const getUserIdBySession = async ({ sessionId }) => {
  const result = await connection.query(
    'SELECT * FROM sessions WHERE id = $1;',
    [sessionId]
  );

  return result.rowCount ? result.rows[0].user_id : 0;
};

export { registerSession, getUserIdBySession };
