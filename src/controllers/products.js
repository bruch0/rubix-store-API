import connection from '../database/database.js';

const getProducts = async (req, res) => {
  const filterCategory = (products, category) => {
    const filtered = products.filter((product) => product.categoryName === category);
    return filtered;
  };

  const { category, order } = req.query;
  let orderBy = '';
  if (order === 'price') {
    orderBy = 'ORDER BY products.value';
  } else {
    orderBy = 'ORDER BY products.value DESC';
  }
  try {
    const result = await connection.query(
      `SELECT products.*, categories.name AS "categoryName"
       FROM products
          JOIN categories
            ON products.category_id = categories.id ${order ? orderBy : ''}
    `,
    );

    const products = result.rows;
    products.forEach((product) => {
      delete product.category_id;
      delete product.description;
      delete product.model;
      delete product.color;
      delete product.brand_id;
      delete product.weight;
      delete product.size;
    });

    if (category) {
      const filteredProducts = filterCategory(products, category);
      res.status(200).send(filteredProducts);
      return;
    }

    res.status(200).send(products);
  } catch {
    res.sendStatus(500);
  }
};

export default getProducts;
