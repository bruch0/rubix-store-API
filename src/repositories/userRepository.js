import connection from '../database/database.js';

const checkUserRegistered = async ({ email, phone, cpf }) => {
  const hasUser = await connection.query(
    `SELECT * FROM users
        WHERE email = $1 OR phone = $2 OR cpf = $3;`,
    [email, phone, cpf]
  );
  return hasUser.rowCount > 0;
};

const getUserByEmail = async ({ email }) => {
  const selectedUser = await connection.query(
    'SELECT * FROM users WHERE email = $1;',
    [email]
  );

  return selectedUser ? selectedUser.rows[0] : 0;
};

const getUserInfoById = async ({ userId }) => {
  const selectedUser = await connection.query(
    'SELECT * FROM users WHERE id = $1;',
    [userId]
  );

  return selectedUser ? selectedUser.rows[0] : 0;
};

const createUser = async ({ name, email, hashedPassword, cpf, phone }) => {
  await connection.query(
    `INSERT INTO users (name, email, password, cpf, phone)
        VALUES ($1, $2, $3, $4, $5);`,
    [name, email, hashedPassword, cpf, phone]
  );

  return true;
};

const changeUserPassword = async ({ email, newPassword }) => {
  await connection.query('UPDATE users SET password = $1 WHERE email = $2', [
    newPassword,
    email,
  ]);

  return true;
};

export {
  checkUserRegistered,
  getUserByEmail,
  getUserInfoById,
  createUser,
  changeUserPassword,
};
