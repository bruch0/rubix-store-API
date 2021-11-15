import joi from 'joi';

const cartSchema = joi.object({
  product_id: joi.number().integer().min(1).required(),
  product_qty: joi.number().integer().min(0).required(),
  isUpdate: joi.boolean(),
});

// eslint-disable-next-line import/prefer-default-export
export { cartSchema };
