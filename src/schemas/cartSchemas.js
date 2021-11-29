import joi from 'joi';

const updateCart = joi.object({
  productId: joi.number().integer().min(1).required(),
  productQty: joi.number().integer().min(0).required(),
  isUpdate: joi.boolean(),
});

// eslint-disable-next-line import/prefer-default-export
export { updateCart };
