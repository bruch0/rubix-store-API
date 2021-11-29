import * as checkoutService from '../services/checkoutService.js';

const getCheckout = async (req, res) => {
  const { sessionId } = req;
  const checkout = await checkoutService.getCheckout({ sessionId });

  res.send(checkout);
};

const buyCheckout = async (req, res) => {
  const { cart, totalValue } = req.body;
  const { sessionId } = req;
  if (!cart || !totalValue || cart.length === 0) return res.sendStatus(400);

  await checkoutService.buyCheckout({ cart, totalValue, sessionId });

  return res.sendStatus(200);
};

export { getCheckout, buyCheckout };
