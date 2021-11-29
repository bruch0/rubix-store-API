import connection from '../database/database.js';

const getProductContentById = async ({ productId }) => {
  const content = await connection.query(
    'SELECT item FROM product_contains WHERE product_id = $1;',
    [productId]
  );

  return content.rows;
};

// eslint-disable-next-line import/prefer-default-export
export { getProductContentById };
