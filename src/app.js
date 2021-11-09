import express from 'express';
import cors from 'cors';
import postSignIn from './controllers/signIn.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/auth/signin', postSignIn);

export default app;
