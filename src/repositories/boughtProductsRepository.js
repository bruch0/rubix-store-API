import connection from '../database/database.js';

const getBoughtProducts = async () => {
  const boughtProducts = await connection.query(
    'SELECT bought_products.product_id, bought_products.qty, bought_products.purchase_id, products.name, products.value FROM bought_products JOIN products ON bought_products.product_id = products.id;'
  );

  return boughtProducts.rows;
};

const insertBoughtProducts = async ({ purchaseId, productId, productQty }) => {
  await connection.query(
    'INSERT INTO bought_products (purchase_id, product_id, qty) VALUES ($1, $2, $3)',
    [purchaseId, productId, productQty]
  );

  return true;
};

export { getBoughtProducts, insertBoughtProducts };
