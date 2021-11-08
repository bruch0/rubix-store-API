import joi from 'joi';

export default function signInSchema() {
  return joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
}
