/* eslint-disable consistent-return */
import connection from '../database/database.js';

const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (Number.isNaN(Number(productId))) {
      return res.status(400).send('Parametro invalido');
    }

    const productResult = await connection.query(
      `SELECT 
        products.*,
        categories.name AS "categoryName",
        products_brands.name AS "brandName"
      FROM products
      JOIN categories
        ON products.category_id = categories.id
      JOIN products_brands
        ON products.brand_id = products_brands.id
      WHERE products.id = $1;`,
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
    res.sendStatus(500);
  }
};

export default getProduct;
