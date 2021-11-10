import express from 'express';
import cors from 'cors';
import signIn from './controllers/signIn.js';
import authenticationJWT from './middlewares/authenticationJWT.js';
import signUp from './controllers/signUp.js';

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

export default app;
