import express from 'express';
import cors from 'cors';

import getProducts from './controllers/products.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/products', getProducts);

app.get('/', (req, res) => res.send('foi'));

export default app;
