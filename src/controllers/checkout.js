import connection from '../database/database.js';

const getUserCheckout = async (req, res) => {
  const groupProducts = (products) => {
    const resultingProducts = [];
    const listedIds = [];
    for (let i = 0; i < products.length; i += 1) {
      let productCount = 1;
      if (listedIds.indexOf(products[i].product_id) === -1) {
        for (let j = 0; j < products.length; j += 1) {
          if (products[i].product_id === products[j].product_id && i !== j) {
            productCount += 1;
            listedIds.push(products[i].product_id);
          }
        }
        resultingProducts.push(
          {
            productId: products[i].product_id,
            productQty: productCount,
            productName: products[i].name,
            totalValue: products[i].value * productCount,
            totalWeight: products[i].weight * productCount,
            productUrl: products[i].url,
          },
        );
      }
    }

    return resultingProducts;
  };

  const calculateTotalValue = (products) => {
    let total = 0;
    products.forEach((product) => {
      total += product.totalValue;
    });

    return total;
  };

  const calculateTotalWeight = (products) => {
    let total = 0;
    products.forEach((product) => {
      total += product.totalWeight;
      delete (product.totalWeight);
    });

    return total;
  };

  const { userId } = req.body;

  if (!userId) {
    res.sendStatus(401);
    return;
  }

  try {
    const result = await connection.query('SELECT cart.*, products.name, products.value, products.weight, products_images.url FROM cart JOIN products ON cart.product_id = products.id JOIN products_images ON cart.product_id = products_images.product_id WHERE cart.user_id = $1', [userId]);
    const cart = groupProducts(result.rows);
    const subTotal = calculateTotalValue(cart);
    const totalWeight = calculateTotalWeight(cart);
    console.log(cart);
    res.send({ cart, subTotal, totalWeight });
  } catch {
    res.sendStatus(500);
  }
};

const buyCart = async (req, res) => {
  const { userId, totalValue, cart } = req.body;

  if (!cart || !userId || !totalValue || cart.length === 0) {
    res.sendStatus(400);
    return;
  }

  try {
    const purchase = await connection.query('INSERT INTO purchases (user_id, total_value) VALUES ($1, $2) RETURNING id', [userId, totalValue]);
    const purchaseId = purchase.rows[0].id;

    cart.forEach(async (product) => {
      await connection.query('INSERT INTO bought_products (purchase_id, product_id, qty) VALUES ($1, $2, $3)', [purchaseId, product.productId, product.productQty]);
    });

    cart.forEach(async (product) => {
      const result = await connection.query('SELECT * FROM products WHERE id = $1', [product.productId]);
      const productQty = result.rows[0].total_qty;
      await connection.query('UPDATE products set total_qty = $1 WHERE id = $2', [productQty - product.productQty, product.productId]);
    });

    await connection.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
};

export {
  getUserCheckout,
  buyCart,
};
