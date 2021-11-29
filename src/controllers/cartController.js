import * as cartService from '../services/cartService.js';

const getCart = async (req, res) => {
  const { sessionId } = req;

  try {
    const cart = await cartService.getCart({ sessionId });

    return res.status(200).send(cart);
  } catch {
    return res.sendStatus(500);
  }
};

const postCart = async (req, res) => {
  const { product_id: productId, product_qty: productQty, isUpdate } = req.body;
  const { sessionId } = req;

  if (!productId || !productQty) return res.sendStatus(400);

  try {
    const success = await cartService.updateCart({
      productId,
      productQty,
      isUpdate,
      sessionId,
    });

    if (success === -2) return res.sendStatus(400);
    if (success === -1) return res.sendStatus(403);

    return res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
};

export { getCart, postCart };
