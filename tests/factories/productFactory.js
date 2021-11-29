import faker from 'faker-br';
import connection from '../../src/database/database.js';

import createCategory from './categoryFactory';
import createBrand from './brandFactory.js';

const createProduct = async () => {
  const result = await connection.query(
    `INSERT INTO products
    (name, category_id, value, description, total_qty, weight, brand_id, model, size, color)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id;`,
    [
      faker.commerce.productName(),
      await createCategory(),
      faker.random.number({
        min: 1999,
        max: 300000,
      }),
      faker.lorem.paragraph(),
      faker.random.number({
        min: 20,
        max: 100,
      }),
      faker.random.number({
        min: 80,
        max: 500,
      }),
      await createBrand(),
      faker.commerce.department(),
      faker.commerce.productMaterial(),
      faker.commerce.color(),
    ]
  );

  const productId = result.rows[0].id;

  const contains = [
    { item: faker.lorem.word() },
    { item: faker.lorem.word() },
    { item: faker.lorem.word() },
  ];

  contains.forEach(async (content) => {
    await connection.query(
      `INSERT INTO product_contains
      (product_id, item) VALUES ($1, $2)`,
      [productId, content.item]
    );
  });

  const images = [
    { url: faker.image.imageUrl() },
    { url: faker.image.imageUrl() },
    { url: faker.image.imageUrl() },
    { url: faker.image.imageUrl() },
  ];

  images.forEach(async (image) => {
    await connection.query(
      `INSERT INTO products_images
      (product_id, url) VALUES ($1, $2)`,
      [productId, image.url]
    );
  });
  return productId;
};

export default createProduct;
