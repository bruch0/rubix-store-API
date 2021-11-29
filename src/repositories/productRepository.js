import connection from '../database/database.js';

const getProducts = async ({ searchFor, orderBy, order }) => {
  const products = await connection.query(
    `SELECT products.*, categories.name AS "categoryName" FROM products JOIN categories ON products.category_id = categories.id ${searchFor} ${
      order ? orderBy : ''
    }`
  );

  return products.rows;
};

const getProductById = async ({ productId }) => {
  const product = await connection.query(
    'SELECT products.*, categories.name AS "categoryName", products_brands.name AS "brandName" FROM products JOIN categories ON products.category_id = categories.id JOIN products_brands ON products.brand_id = products_brands.id WHERE products.id = $1;',
    [productId]
  );

  return product.rowCount ? product.rows[0] : 0;
};

const getProductQtyById = async ({ productId }) => {
  const products = await connection.query(
    'SELECT total_qty FROM products WHERE id = $1;',
    [productId]
  );

  return products.rows.length ? products.rows[0].total_qty : 0;
};

const updateProductQty = async ({ newQty, productId }) => {
  await connection.query('UPDATE products set total_qty = $1 WHERE id = $2', [
    newQty,
    productId,
  ]);
};

export { getProducts, getProductById, getProductQtyById, updateProductQty };
