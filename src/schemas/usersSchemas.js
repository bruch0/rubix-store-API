import joi from 'joi';

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

// eslint-disable-next-line import/prefer-default-export
export { signInSchema };
