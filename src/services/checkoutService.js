import * as sessionRepository from '../repositories/sessionRepository.js';
import * as cartRepository from '../repositories/cartRepository.js';
import * as productImageRepository from '../repositories/productImagesRepository.js';
import * as purchaseRepository from '../repositories/purchasesRepository.js';
import * as boughtProductsRepository from '../repositories/boughtProductsRepository.js';
import * as productRepository from '../repositories/productRepository.js';
import * as userRepository from '../repositories/userRepository.js';
import * as mailService from './mailService.js';

const getCheckout = async ({ sessionId }) => {
  const createProductArray = (userProducts) => {
    const resultingProducts = [];

    userProducts.forEach((product) => {
      resultingProducts.push({
        productId: product.product_id,
        productQty: product.qty,
        productName: product.name,
        totalValue: product.value * product.qty,
        totalWeight: product.weight * product.qty,
      });
    });

    return resultingProducts;
  };

  const addProductUrl = async (userProducts, images) => {
    if (userProducts.length === 0) return userProducts;

    const listedIds = [];
    const urls = [];
    images.forEach((url) => {
      if (listedIds.indexOf(url.product_id) === -1) {
        urls.push(url.url);
        listedIds.push(url.product_id);
      }
    });

    userProducts.forEach((product, index) => {
      product.productUrl = urls[index];
    });

    return userProducts;
  };

  const calculateTotalValue = (userProducts) => {
    let total = 0;
    userProducts.forEach((product) => {
      total += product.totalValue;
    });

    return total;
  };

  const calculateTotalWeight = (userProducts) => {
    let total = 0;
    userProducts.forEach((product) => {
      total += product.totalWeight;
      delete product.totalWeight;
    });

    return total;
  };

  const userId = await sessionRepository.getUserIdBySession({ sessionId });
  const products = await cartRepository.getCartByUserId({ userId });
  const images = await productImageRepository.getProductsImages();

  
  const userProducts = createProductArray(products);
  const subTotal = calculateTotalValue(userProducts);
  const totalWeight = calculateTotalWeight(userProducts);
  const cart = await addProductUrl(userProducts, images);

  return { cart, subTotal, totalWeight };
};

const buyCheckout = async ({ cart, totalValue, sessionId }) => {
  const userId = await sessionRepository.getUserIdBySession({ sessionId });
  const purchaseId = await purchaseRepository.insertPurchaseAndReceiveId({
    userId,
    totalValue,
  });

  cart.forEach(async (product) => {
    await boughtProductsRepository.insertBoughtProducts({
      purchaseId,
      productId: product.productId,
      productQty: product.productQty,
    });

    const totalProductQty = await productRepository.getProductQtyById({
      productId: product.productId,
    });

	await productRepository.updateProductQty({
      newQty: Number(totalProductQty) - Number(product.productQty),
      productId: product.productId,
    });
  });

  await cartRepository.removeAllCart({ userId });

  const userInfo = await userRepository.getUserInfoById({ userId });
  const { email } = userInfo;

  mailService.sendPurchaseConfirmationEmail({ email, totalValue });

  return true;
};

export { getCheckout, buyCheckout };
