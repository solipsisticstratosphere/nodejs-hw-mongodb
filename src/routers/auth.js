import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { authLoginSchema, authRegisterSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerController } from '../controllers/auth.js';
const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(registerController),
);

authRouter.post('/login', validateBody(authLoginSchema), ctrlWrapper());

export default authRouter;
