import createHttpError from 'http-errors';
import { UserColletion } from '../db/models/user.js';
import bccrypt from 'bcrypt';
import SessionCollection from '../db/models/session.js';
import { randomBytes } from 'crypto';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/user.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { sendMail } from '../utils/sendMail.js';
import { SMTP } from '../constants/contacts.js';
import { TEMPLATES_DIR } from '../constants/index.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import handlebars from 'handlebars';
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

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

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();
  return SessionCollection.create({ userId: user._id, ...newSession }) || {};
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ userId: session.userId });
  const newSession = createSession();

  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UserColletion.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), {
    expiresIn: '15m',
  });

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendMail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UserColletion.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bccrypt.hash(payload.password, 10);

  await UserColletion.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
export const logout = (sessionId) => {
  SessionCollection.deleteOne({ _id: sessionId });
};

export const findSession = (filter) => SessionCollection.findOne(filter);

export const findUser = (filter) => UserColletion.findOne(filter);
