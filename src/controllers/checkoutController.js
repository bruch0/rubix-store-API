import * as checkoutService from '../services/checkoutService.js';

const getCheckout = async (req, res) => {
  const { sessionId } = req;

  try {
    const checkout = await checkoutService.getCheckout({ sessionId });

    return res.send(checkout);
  } catch {
    return res.sendStatus(500);
  }
};

const buyCheckout = async (req, res) => {
  const { cart, totalValue } = req.body;
  const { sessionId } = req;
  if (!cart || !totalValue || cart.length === 0) return res.sendStatus(400);

  try {
    await checkoutService.buyCheckout({ cart, totalValue, sessionId });

    return res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
};

export { getCheckout, buyCheckout };
