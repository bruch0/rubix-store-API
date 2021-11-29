import connection from '../database/database.js';

const registerRecoveryAttempt = async ({ userId, token }) => {
  await connection.query(
    'INSERT INTO recovery_password (user_id, token, creation_date) VALUES ($1, $2, $3)',
    [userId, token, Date.now()]
  );

  return true;
};

const authorizeRecoveryRoute = async ({ token }) => {
  const result = await connection.query(
    'SELECT recovery_password.*, users.email AS "userEmail" FROM recovery_password JOIN users ON recovery_password.user_id = users.id WHERE recovery_password.token = $1',
    [token]
  );

  return result.rowCount >= 1
    ? {
        creationDate: result.rows[0].creation_date,
        userEmail: result.rows[0].userEmail,
      }
    : false;
};

export { registerRecoveryAttempt, authorizeRecoveryRoute };
