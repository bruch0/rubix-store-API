import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import * as userSchemas from '../schemas/userSchemas.js';
import * as userRepository from '../repositories/userRepository.js';
import * as sessionRepository from '../repositories/sessionRepository.js';
import * as passwordRecoveryRepository from '../repositories/passwordRecoveryRepository.js';
import * as purchasesRepository from '../repositories/purchasesRepository.js';
import * as productImagesRepository from '../repositories/productImagesRepository.js';
import * as boughtProductsRepository from '../repositories/boughtProductsRepository.js';
import * as mailService from './mailService.js';

const signUp = async ({ name, email, password, cpf, phone }) => {
  const validation = userSchemas.signUp.validate({
    name,
    email,
    password,
    cpf,
    phone,
  });

  if (validation.error) return -2;

  const userRegistered = await userRepository.checkUserRegistered({
    email,
    phone,
    cpf,
  });
  if (userRegistered) return -1;

  const hashedPassword = hashSync(password, 10);

  await userRepository.createUser({ name, email, hashedPassword, cpf, phone });

  return 1;
};

const signIn = async ({ email, password }) => {
  const validation = userSchemas.signIn.validate({
    email,
    password,
  });

  if (validation.error) return -2;

  const user = await userRepository.getUserByEmail({ email });

  if (!user) return -1;

  if (!compareSync(password, user.password)) return -1;

  const sessionId = await sessionRepository.registerSession({
    userId: user.id,
  });

  const token = jwt.sign(
    {
      sessionId,
    },
    process.env.JWT_SECRET,
    { expiresIn: 3600 * 48 }
  );

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    phone: user.phone,
    token,
  };
};

const getUserInfo = async ({ sessionId }) => {
  const userId = await sessionRepository.getUserIdBySession({ sessionId });
  const userInfo = await userRepository.getUserInfoById({ userId });
  const purchases = await purchasesRepository.getUserPurchases({ userId });
  const images = await productImagesRepository.getProductsImages();
  const allBoughtProducts = await boughtProductsRepository.getBoughtProducts();
  const purchasesIds = [];

  purchases.forEach((purchase) => purchasesIds.push(purchase.id));

  const boughtProducts = allBoughtProducts.filter(
    (product) => purchasesIds.indexOf(product.purchase_id) !== -1
  );

  purchases.forEach((purchase) => {
    const purchaseProducts = boughtProducts.filter(
      (product) => product.purchase_id === purchase.id
    );

    purchaseProducts.forEach((product) => {
      const productImages = images.filter(
        (image) => image.product_id === product.product_id
      );

      product.imgUrl = productImages[0]?.url;
    });

    purchase.boughtProducts = purchaseProducts;
  });

  return { ...userInfo, purchases };
};

const requestRecoveryPasswordMail = async ({ email }) => {
  const validEmail = /[a-zA-Z0-9]+@+[a-zA-Z0-9]+\.+[a-zA-Z0-9]/.test(email);

  if (!validEmail) return -1;

  const user = await userRepository.getUserByEmail({ email });

  if (!user) return 0;

  const token = uuid();

  await passwordRecoveryRepository.registerRecoveryAttempt({
    userId: user.id,
    token,
  });

  mailService.sendPasswordRecoveryMail({ email, token });

  return true;
};

const authorizeRecoveryPasswordRoute = async ({ token }) => {
  const { creationDate, userEmail } =
    await passwordRecoveryRepository.authorizeRecoveryRoute({
      token,
    });

  if (!creationDate) return -1;

  const convertMilisecondsToMinutes = 60000;
  const minutesSinceCreation = parseInt(
    (Date.now() - creationDate) / convertMilisecondsToMinutes,
    10
  );

  if (minutesSinceCreation >= 15) return 0;

  return userEmail;
};

const changeUserPassword = async ({ email, newPassword }) => {
  const hashedPassword = hashSync(newPassword, 10);

  await userRepository.changeUserPassword({
    email,
    newPassword: hashedPassword,
  });

  return true;
};

export {
  signUp,
  signIn,
  getUserInfo,
  requestRecoveryPasswordMail,
  authorizeRecoveryPasswordRoute,
  changeUserPassword,
};
