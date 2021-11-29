/* eslint-disable camelcase */
import express from 'express';
import cors from 'cors';
import authenticationJWT from './middlewares/authenticationJWT.js';
import * as userController from './controllers/userController.js';
import * as productController from './controllers/productController.js';
import * as cartController from './controllers/cartController.js';
import * as checkoutController from './controllers/checkoutController.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/auth/sign-in', userController.signIn);
app.post('/auth/sign-up', userController.signUp);

app.get('/products', productController.getProducts);
app.get('/products/:productId', productController.getProductById);

app.get('/cart', authenticationJWT, cartController.getCart);
app.post('/cart', authenticationJWT, cartController.postCart);

app.post('/recover-password', userController.requestRecoveryPasswordMail);

app.post('/authorize-password', userController.authorizeRecoveryPasswordRoute);

app.post('/change-password', userController.changeUserPassword);

app.get('/checkout', authenticationJWT, checkoutController.getCheckout);

app.post('/checkout', authenticationJWT, checkoutController.buyCheckout);

app.get('/user', authenticationJWT, userController.getUserInfo);

export default app;
