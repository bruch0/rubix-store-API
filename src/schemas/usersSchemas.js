import joi from 'joi';

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const signUpSchema = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
  phone: joi.string().length(11).pattern(/^[0-9]+$/).required(),
  password: joi.string().min(6).required(),
  confirmPassword: joi.ref('password'),
});

export { signInSchema, signUpSchema };
