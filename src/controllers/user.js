/* eslint-disable no-await-in-loop */
import connection from '../database/database.js';

const getAuthenticatedUserId = async (sessionId) => {
  const result = await connection.query(
    'SELECT * FROM sessions WHERE id = $1;',
    [sessionId],
  );
  return result.rows[0].user_id;
};

const getUserInfo = async (req, res) => {
  try {
    const userId = await getAuthenticatedUserId(req.sessionId);

    const userResult = await connection.query(
      `SELECT name, cpf, email, phone
      FROM users
      WHERE id = $1;`,
      [userId],
    );

    const userInfo = userResult.rows[0];

    const resultPurchases = await connection.query(
      `SELECT id, total_value, creation_date
      FROM purchases
      WHERE user_id = $1;`,
      [userId],
    );
    const purchases = resultPurchases.rows;

    // eslint-disable-next-line no-restricted-syntax
    for (const purchase of purchases) {
      const resultBoughtProducts = await connection.query(
        `SELECT
          bought_products.product_id, bought_products.qty,
          products.name, products.value
        FROM bought_products
        JOIN products
          ON bought_products.product_id = products.id
        WHERE purchase_id = $1;`,
        [purchase.id],
      );
      const boughtProducts = resultBoughtProducts.rows;

      const resultImages = await connection.query(
        'SELECT url, product_id FROM products_images;',
      );

      boughtProducts.forEach((product) => {
        product.imageUrl = resultImages.rows.filter(
          (img) => img.product_id !== product.id,
        )[0].url;
      });
      purchase.bought_products = boughtProducts;
    }

    res.status(200).send({
      ...userInfo,
      purchases,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export default getUserInfo;
