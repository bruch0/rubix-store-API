/* eslint-disable consistent-return */
import connection from '../database/database.js';
import { cartSchema } from '../schemas/cartSchemas.js';

export default async function postCart(req, res) {
  try {
    const {
      product_id: productId,
      product_qty: productQty,
    } = req.body;

    const { error: errorValidation } = cartSchema.validate(req.body, { abortEarly: false });

    if (errorValidation) {
      return res.status(400).send(errorValidation.details[0].message);
    }

    const resultProducts = await connection.query(
      'SELECT total_qty FROM products WHERE id = $1;',
      [productId],
    );

    if (resultProducts.rowCount === 0) {
      return res.status(404).send('Produto não existe.');
    }

    const maxQuantity = resultProducts.rows[0]?.total_qty;

    if (productQty > maxQuantity) {
      return res.status(400).send('Quantidade maior que o estoque.');
    }

    const result = await connection.query(
      'SELECT * FROM sessions WHERE id = $1;',
      [req.sessionId],
    );

    const userId = result.rows[0].user_id;

    await connection.query(
      `INSERT INTO cart
          (user_id, product_id, product_qty)
          VALUES ($1, $2, $3)`,
      [userId, productId, productQty],
    );

    res.status(200).send('Produto adicionado ao carrinho!');
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}
