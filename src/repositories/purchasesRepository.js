import connection from '../database/database.js';

const getUserPurchases = async ({ userId }) => {
  const purchases = await connection.query(
    'SELECT id, total_value, creation_date FROM purchases WHERE user_id = $1',
    [userId]
  );

  return purchases.rows;
};

const insertPurchaseAndReceiveId = async ({ userId, totalValue }) => {
  const purchase = await connection.query(
    'INSERT INTO purchases (user_id, total_value) VALUES ($1, $2) RETURNING id',
    [userId, totalValue]
  );

  return purchase.rows[0].id;
};

export { getUserPurchases, insertPurchaseAndReceiveId };
