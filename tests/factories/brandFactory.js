import connection from '../../src/database/database.js';

const createBrand = async () => {
  const result = await connection.query(
    `INSERT INTO products_brands (name) VALUES ($1)
    RETURNING id;`,
    ['Moyu']
  );
  return Number(result.rows[0].id);
};

export default createBrand;
