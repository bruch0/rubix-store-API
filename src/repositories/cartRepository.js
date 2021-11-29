import connection from '../database/database.js';

const getCartByUserId = async ({ userId }) => {
  const cart = await connection.query(
    'SELECT cart.product_qty AS "qty", cart.product_id, products.name, products.value, products.total_qty FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = $1',
    [userId]
  );

  return cart.rows;
};

const sumCart = async ({ productId, userId }) => {
  const cartSum = await connection.query(
    'SELECT SUM(product_qty) AS total FROM cart WHERE product_id = $1 AND user_id = $2',
    [productId, userId]
  );

  return cartSum.rows[0].total;
};

const removeProduct = async ({ productId, userId }) => {
  await connection.query(
    'DELETE FROM cart WHERE product_id = $1 AND user_id = $2',
    [productId, userId]
  );

  return true;
};

const updateProductQty = async ({ productQty, productId, userId }) => {
  await connection.query(
    'UPDATE cart SET product_qty = $1 WHERE product_id = $2 AND user_id = $3',
    [productQty, productId, userId]
  );

  return true;
};

const increaseProductQty = async ({
  productQty,
  currentQtyCart,
  productId,
  userId,
}) => {
  await connection.query(
    'UPDATE cart SET product_qty = $1 WHERE product_id = $2 AND user_id = $3',
    [productQty + currentQtyCart, productId, userId]
  );

  return true;
};

const addToCart = async ({ userId, productId, productQty }) => {
  await connection.query(
    'INSERT INTO cart (user_id, product_id, product_qty) VALUES ($1, $2, $3)',
    [userId, productId, productQty]
  );

  return true;
};

const removeAllCart = async ({ userId }) => {
  await connection.query('DELETE FROM cart WHERE user_id = $1', [userId]);

  return true;
};

export {
  getCartByUserId,
  sumCart,
  removeProduct,
  removeAllCart,
  updateProductQty,
  increaseProductQty,
  addToCart,
};
