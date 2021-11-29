import joi from 'joi';

const signIn = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const signUp = joi.object({
  name: joi.string().min(3).required(),
  email: joi
    .string()
    .email()
    .required()
    .pattern(/[a-zA-Z0-9]+@+[a-zA-Z0-9]+\.+[a-zA-Z0-9]/),
  cpf: joi
    .string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  phone: joi
    .string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  password: joi.string().min(8).required(),
});

export { signIn, signUp };
