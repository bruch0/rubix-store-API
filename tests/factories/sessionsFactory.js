import connection from '../../src/database/database.js';

import createUser from './userFactory.js';

const createSession = async () => {
  const { id: userId } = await createUser();

  const result = await connection.query(
    `INSERT INTO sessions 
    (user_id) VALUES ($1)
    RETURNING id;`,
    [userId]
  );
  return result.rows[0].id;
};

export default createSession;
