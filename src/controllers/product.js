/* eslint-disable consistent-return */
import connection from '../database/database.js';

const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const productResult = await connection.query(
      'SELECT * FROM products WHERE id = $1;',
      [productId],
    );

    if (productResult.rowCount === 0) {
      return res.status(404).send('Produto não encontrado');
    }

    const product = productResult.rows[0];

    const productImages = await connection.query(
      'SELECT url FROM products_images WHERE product_id = $1;',
      [productId],
    );
    product.images = productImages.rows.map((imgUrl) => imgUrl);

    const productContent = await connection.query(
      'SELECT item FROM product_contains WHERE product_id = $1;',
      [productId],
    );
    product.contains = productContent.rows.map((item) => item);

    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export default getProduct;
