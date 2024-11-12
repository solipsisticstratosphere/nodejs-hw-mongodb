import { login, register } from '../services/auth.js';

export const registerController = async (req, res) => {
  const data = await register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registerd user',
  });
};

export const loginController = async (req, res) => {
  const data = await login(req.body);
};
