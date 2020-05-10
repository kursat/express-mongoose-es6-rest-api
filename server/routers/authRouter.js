import { Router } from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import authController from '../controllers/authController';

const authRouter = Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
authRouter.route('/login')
  .post(validate(paramValidation.login), authController.login);

export default authRouter;
