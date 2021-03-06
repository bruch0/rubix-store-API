import * as productService from '../services/productService.js';

const getProducts = async (req, res) => {
  const { search, order, category } = req.query;

  try {
    const products = await productService.getProducts({
      search,
      order,
      category,
    });

    return res.send(products);
  } catch {
    return res.sendStatus(500);
  }
};

const getProductById = async (req, res) => {
  const { productId } = req.params;

  if (Number.isNaN(Number(productId))) return res.sendStatus(400);

  try {
    const product = await productService.getProductById({ productId });

    if (!product) return res.sendStatus(404);

    return res.send(product);
  } catch {
    return res.sendStatus(500);
  }
};

export { getProducts, getProductById };
