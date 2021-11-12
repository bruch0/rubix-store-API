import joi from 'joi';

const passwordRecoverySchema = joi.object({
  email: joi.string().email().min(5).required(),
});

// eslint-disable-next-line import/prefer-default-export
export { passwordRecoverySchema };
