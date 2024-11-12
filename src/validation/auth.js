import Joi from 'joi';
import { emailRegexp } from '../constants/user.js';

export const authRegisterSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(3).max(16).required(),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
