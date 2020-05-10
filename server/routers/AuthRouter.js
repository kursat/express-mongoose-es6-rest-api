import {Router} from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import AuthController from '../controllers/AuthController';

const AuthRouter = Router();

/** POST /api/auth/login - Returns token if correct username and password is provided */
AuthRouter.route('/login').post(
	validate(paramValidation.login),
	AuthController.login,
);

export default AuthRouter;
