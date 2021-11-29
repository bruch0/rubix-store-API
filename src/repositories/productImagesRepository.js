import connection from '../database/database.js';

const getProductsImages = async () => {
  const images = await connection.query(
    'SELECT url, product_id FROM products_images;'
  );

  return images.rows;
};

const getProductsImagesById = async ({ productId }) => {
  const images = await connection.query(
    'SELECT * FROM products_images WHERE product_id = $1',
    [productId]
  );

  return images.rows;
};

export { getProductsImages, getProductsImagesById };
