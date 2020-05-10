import {Router} from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import config from '../../config/config';
import UserController from '../controllers/UserController';

const UserRouter = Router(); // eslint-disable-line new-cap

UserRouter.route('/')
	/** GET /api/users - Get list of users */
	.get(expressJwt({secret: config.jwtSecret}), UserController.list)

	/** POST /api/users - Create new user */
	.post(
		[
			// expressJwt({ secret: config.jwtSecret }),
			validate(paramValidation.createUser),
		],
		UserController.create,
	);

UserRouter.route('/:userId')
	/** GET /api/users/:userId - Get user */
	.get(expressJwt({secret: config.jwtSecret}), UserController.get)

	/** PUT /api/users/:userId - Update user */
	.put(
		[
			expressJwt({secret: config.jwtSecret}),
			validate(paramValidation.updateUser),
		],
		UserController.update,
	)

	/** DELETE /api/users/:userId - Delete user */
	.delete(expressJwt({secret: config.jwtSecret}), UserController.remove);

/** Load user when API with userId route parameter is hit */
UserRouter.param('userId', UserController.load);

export default UserRouter;
