import * as sessionRepository from '../repositories/sessionRepository.js';
import * as cartRepository from '../repositories/cartRepository.js';
import * as productImagesRepository from '../repositories/productImagesRepository.js';
import * as productRepository from '../repositories/productRepository.js';
import * as cartSchemas from '../schemas/cartSchemas.js';

const getCart = async ({ sessionId }) => {
  const userId = await sessionRepository.getUserIdBySession({ sessionId });

  const cart = await cartRepository.getCartByUserId({ userId });

  const images = await productImagesRepository.getProductsImages();

  cart.forEach((product) => {
    product.imageUrl = images.rows.filter(
      (img) => img.product_id === product.product_id
    )[0].url;
  });

  return cart;
};

const updateCart = async ({ productId, productQty, isUpdate, sessionId }) => {
  const validation = cartSchemas.updateCart.validate({
    productId,
    productQty,
    isUpdate,
  });

  if (validation.error) return -2;

  const userId = await sessionRepository.getUserIdBySession({ sessionId });

  const currentQtyCart = Number(
    await cartRepository.sumCart({ productId, userId })
  );

  const maxQuantity = await productRepository.getProductQtyById({ productId });

  if (
    (!isUpdate && productQty + currentQtyCart > maxQuantity) ||
    productQty > maxQuantity
  ) {
    return -1;
  }

  if (productQty === 0) {
    await cartRepository.removeProduct({ productId, userId });
    return 1;
  }

  if (isUpdate) {
    await cartRepository.updateProductQty({ productId, userId, productQty });
    return 1;
  }

  if (currentQtyCart) {
    await cartRepository.increaseProductQty({
      productQty,
      productId,
      userId,
      currentQtyCart,
    });
    return 1;
  }

  await cartRepository.addToCart({ userId, productId, productQty });
  return 1;
};

export { getCart, updateCart };
