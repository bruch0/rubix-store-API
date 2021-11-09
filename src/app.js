import express from 'express';
import cors from 'cors';
import postSignIn from './controllers/signIn.js';
import verifyJWT from './middlewares/verifyJWT.js';
import postSignUp from './controllers/signUp.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/auth/sign-in', postSignIn);
app.post('/auth/sign-up', postSignUp);

app.get('/teste-auth', verifyJWT, (req, res) => {
  res.send('Autenticado!');
});

export default app;
