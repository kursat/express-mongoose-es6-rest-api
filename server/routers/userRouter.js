import { Router } from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userController from '../controllers/userController';
import config from '../../config/config';

const userRouter = Router(); // eslint-disable-line new-cap

userRouter.route('/')
  /** GET /api/users - Get list of users */
  .get(expressJwt({ secret: config.jwtSecret }), userController.list)

  /** POST /api/users - Create new user */
  .post(
    [
      // expressJwt({ secret: config.jwtSecret }),
      validate(paramValidation.createUser)
    ],
    userController.create
  );

userRouter.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(expressJwt({ secret: config.jwtSecret }), userController.get)

  /** PUT /api/users/:userId - Update user */
  .put(
    [
      expressJwt({ secret: config.jwtSecret }),
      validate(paramValidation.updateUser)
    ],
    userController.update
  )

  /** DELETE /api/users/:userId - Delete user */
  .delete(expressJwt({ secret: config.jwtSecret }), userController.remove);

/** Load user when API with userId route parameter is hit */
userRouter.param('userId', userController.load);

export default userRouter;
