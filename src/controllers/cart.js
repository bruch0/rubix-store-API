/* eslint-disable consistent-return */
import connection from '../database/database.js';
import { cartSchema } from '../schemas/cartSchemas.js';

const getAuthenticatedUserId = async (sessionId) => {
  const result = await connection.query(
    'SELECT * FROM sessions WHERE id = $1;',
    [sessionId],
  );
  return result.rows[0].user_id;
};

const postCart = async (req, res) => {
  try {
    const {
      product_id: productId,
      product_qty: productQty,
      isUpdate,
    } = req.body;

    const userId = await getAuthenticatedUserId(req.sessionId);

    const { error: errorValidation } = cartSchema.validate(req.body, {
      abortEarly: false,
    });

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
    const cartSumResult = await connection.query(
      `SELECT SUM(product_qty) AS total
      FROM cart
      WHERE product_id = $1 AND user_id = $2;`,
      [productId, userId],
    );

    const currentQtyCart = Number(cartSumResult.rows[0]?.total);
    const maxQuantity = resultProducts.rows[0]?.total_qty;

    if ((!isUpdate && (productQty + currentQtyCart) > maxQuantity) || productQty > maxQuantity) {
      return res.status(400).send('Quantidade maior que o estoque.');
    }

    if (productQty === 0) {
      await connection.query(
        `DELETE FROM cart
        WHERE product_id = $1 AND user_id = $2;`,
        [productId, userId],
      );
      return res.status(200).send('Produto removido do carrinho.');
    }

    if (isUpdate) {
      await connection.query(
        `UPDATE cart SET product_qty = $1
        WHERE product_id = $2 AND user_id = $3;`,
        [productQty, productId, userId],
      );
      return res.status(200).send('Quantidade atualizada no carrinho.');
    }

    if (currentQtyCart) {
      await connection.query(
        `UPDATE cart SET product_qty = $1
        WHERE product_id = $2 AND user_id = $3;`,
        [productQty + currentQtyCart, productId, userId],
      );
      return res.status(200).send('Quantidade atualizada no carrinho.');
    }

    await connection.query(
      `INSERT INTO cart
          (user_id, product_id, product_qty)
          VALUES ($1, $2, $3)`,
      [userId, productId, productQty],
    );
    res.status(200).send('Novo produto adicionado ao carrinho.');
  } catch (err) {
    res.status(500);
  }
};

const getCart = async (req, res) => {
  try {
    const userId = await getAuthenticatedUserId(req.sessionId);

    const productResult = await connection.query(
      `SELECT
        cart.product_qty AS "qty", cart.product_id,
        products.name, products.value, products.total_qty
      FROM cart
      JOIN products
        ON cart.product_id = products.id
      WHERE cart.user_id = $1;`,
      [userId],
    );

    const products = productResult.rows;

    const resultImages = await connection.query(
      'SELECT url, product_id FROM products_images;',
    );

    const images = resultImages.rows;

    products.forEach((product, index) => {
      product.imageUrl = images[index].url;
    });

    res.status(200).send(products);
  } catch (err) {
    res.sendStatus(500);
  }
};

export { postCart, getCart };
