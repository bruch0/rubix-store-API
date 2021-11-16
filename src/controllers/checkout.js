import sendgridMail from '@sendgrid/mail';
import connection from '../database/database.js';

const getAuthenticatedUserId = async (sessionId) => {
  const result = await connection.query(
    'SELECT * FROM sessions WHERE id = $1;',
    [sessionId],
  );
  return result.rows[0].user_id;
};

const getUserCheckout = async (req, res) => {
  const createProductArray = (products) => {
    const resultingProducts = [];

    products.forEach((product) => {
      resultingProducts.push(
        {
          productId: product.product_id,
          productQty: product.product_qty,
          productName: product.name,
          totalValue: product.value * product.product_qty,
          totalWeight: product.weight * product.product_qty,
        },
      );
    });

    return resultingProducts;
  };

  const addProductUrl = async (products) => {
    let query = `WHERE product_id = ${products[0].productId}`;
    for (let i = 1; i < products.length; i += 1) {
      query += ` OR product_id = ${products[i].productId}`;
    }

    const result = await connection.query(`SELECT * FROM products_images ${query}`);

    const listedIds = [];
    const urls = [];
    result.rows.forEach((url) => {
      if (listedIds.indexOf(url.product_id) === -1) {
        urls.push(url.url);
        listedIds.push(url.product_id);
      }
    });

    products.forEach((product, index) => {
      product.productUrl = urls[index];
    });

    return products;
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

  const userId = await getAuthenticatedUserId(req.sessionId);

  try {
    const result = await connection.query('SELECT cart.*, products.name, products.value, products.weight FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = $1', [userId]);
    const products = createProductArray(result.rows);
    const subTotal = calculateTotalValue(products);
    const totalWeight = calculateTotalWeight(products);
    const cart = await addProductUrl(products);
    res.send({ cart, subTotal, totalWeight });
  } catch {
    res.sendStatus(500);
  }
};

const buyCart = async (req, res) => {
  const { totalValue, cart } = req.body;

  const userId = await getAuthenticatedUserId(req.sessionId);

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

    sendgridMail.setApiKey(process.env.SENGRID_API_KEY);

    const mailMessage = `
        <h1>Rubix Store<h1>
        <h3>Obrigado por comprar conosco!</h3>
        <h4>Valor total da compra: R$ ${totalValue / 100}</h4>
    `;

    const result = await connection.query('SELECT * FROM users WHERE id = $1', [userId]);
    const { email } = result.rows[0];
    console.log(email);
    const mail = {
      to: email,
      from: 'rubix.store.oficial@gmail.com',
      subject: 'Compra aprovada!',
      html: mailMessage,
    };

    sendgridMail.send(mail);

    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
};

export {
  getUserCheckout,
  buyCart,
};
