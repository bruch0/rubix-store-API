import * as productRepository from '../repositories/productRepository.js';
import * as productImagesRepository from '../repositories/productImagesRepository.js';
import * as productContentRepository from '../repositories/productContentRepository.js';

const getProducts = async ({ search, order, category }) => {
  let orderBy = '';
  let searchFor = '';

  if (order === '-price') {
    orderBy = 'ORDER BY products.value DESC';
  } else {
    orderBy = 'ORDER BY products.value';
  }

  if (search) {
    searchFor = `WHERE products.name ILIKE '%${search}%'`;
  }

  const products = await productRepository.getProducts({
    searchFor,
    orderBy,
    order,
  });
  const images = await productImagesRepository.getProductsImages();

  products.forEach((product) => {
    delete product.category_id;
    delete product.description;
    delete product.model;
    delete product.color;
    delete product.brand_id;
    delete product.weight;
    delete product.size;
    product.imageUrl = images.filter(
      (img) => img.product_id === product.id
    )[0].url;
  });

  if (category) {
    const filteredProducts = products.filter(
      (product) => product.categoryName === category
    );
    return filteredProducts;
  }

  return products;
};

const getProductById = async ({ productId }) => {
  const product = await productRepository.getProductById({ productId });

  if (!product) return 0;

  const images = await productImagesRepository.getProductsImagesById({
    productId,
  });

  const content = await productContentRepository.getProductContentById({
    productId,
  });

  product.images = images.map((imgUrl) => imgUrl);
  product.contains = content.map((item) => item);

  return product;
};

export { getProducts, getProductById };
