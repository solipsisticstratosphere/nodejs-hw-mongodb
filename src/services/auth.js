import createHttpError from 'http-errors';
import { UserColletion } from '../db/models/user.js';
import bccrypt from 'bcrypt';
export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UserColletion.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const hashPassword = await bccrypt.hash(password, 10);
  return UserColletion.create({ ...payload, password: hashPassword });
};

export const login = async (payload) => {
  const { email, password } = payload;
  const user = await UserColletion.findOne({ email });
  if (!user) {
    throw createHttpError(401, ' Email or password invalid');
  }
  const passwordCompare = await bccrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, ' Email or password invalid');
  }
};
