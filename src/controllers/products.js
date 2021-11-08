import connection from '../database/database.js';

const getProducts = async (req, res) => {
  try {
    const result = await connection.query('SELECT * FROM products');
    const products = result.rows;
    res.status(200).send(products);
  } catch {
    res.sendStatus(500);
  }
};

export default getProducts;
