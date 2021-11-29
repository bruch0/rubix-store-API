import connection from '../../src/database/database.js';

const createCategory = async () => {
  const result = await connection.query(
    `INSERT INTO categories (name) VALUES ($1)
    RETURNING id;`,
    ['3x3x3']
  );
  return Number(result.rows[0].id);
};

export default createCategory;
