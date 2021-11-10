/* eslint-disable camelcase */
import express from 'express';
import cors from 'cors';
import signIn from './controllers/signIn.js';
import authenticationJWT from './middlewares/authenticationJWT.js';
import signUp from './controllers/signUp.js';
import connection from './database/database.js';

import getProducts from './controllers/products.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/auth/sign-in', signIn);
app.post('/auth/sign-up', signUp);

app.get('/teste-auth', authenticationJWT, (req, res) => {
  res.send(`Autenticado! userId: ${req.sessionId}`);
});

app.get('/products', getProducts);

app.post('/cart', authenticationJWT, (req, res) => {
  res.send('adicionado');
});

// DEV_ROUTES
app.post('/add-category', async (req, res) => {
  await connection.query(
    'INSERT INTO categories (name) VALUES ($1)',
    [req.body.name],
  );
  res.send('Criada.');
});

app.post('/add-brand', async (req, res) => {
  await connection.query(
    'INSERT INTO products_brands (name) VALUES ($1)',
    [req.body.name],
  );
  res.send('Criado.');
});

app.post('/add-product', async (req, res) => {
  const {
    name,
    category_id,
    value,
    description,
    total_qty,
    weight,
    brand_id,
    model,
    size,
    color,
    contains,
    images,
  } = req.body;

  const result = await connection.query(
    `INSERT INTO products
    (name, category_id, value, description, total_qty, weight, brand_id, model, size, color)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id;`,
    [name, category_id, value, description, total_qty, weight, brand_id, model, size, color],
  );

  const productId = result.rows[0].id;

  contains.forEach(async (content) => {
    await connection.query(
      `INSERT INTO product_contains
      (product_id, item) VALUES ($1, $2)`,
      [productId, content.item],
    );
  });

  images.forEach(async (image) => {
    await connection.query(
      `INSERT INTO products_images
      (product_id, url) VALUES ($1, $2)`,
      [productId, image.url],
    );
  });

  res.send('Produto cadastrado!');
});

export default app;
