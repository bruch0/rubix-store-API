import joi from 'joi';

const cartSchema = joi.object({
  product_id: joi.number().integer().min(0).required(),
  product_qty: joi.number().integer().min(0).required(),
});

// eslint-disable-next-line import/prefer-default-export
export { cartSchema };
