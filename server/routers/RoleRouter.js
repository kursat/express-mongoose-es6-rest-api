import {Router} from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import RoleController from '../controllers/RoleController';
import config from '../../config/config';

// eslint-disable-next-line new-cap
const RoleRouter = Router();

RoleRouter.route('/')
	.get(expressJwt({secret: config.jwtSecret}), RoleController.list)
	.post(
		[
			expressJwt({secret: config.jwtSecret}),
			validate(paramValidation.createRole),
		],
		RoleController.create,
	);

RoleRouter.route('/:roleId')
	.get(expressJwt({secret: config.jwtSecret}), RoleController.get)
	.put(
		[
			expressJwt({secret: config.jwtSecret}),
			validate(paramValidation.updateRole),
		],
		RoleController.update,
	)
	.delete(expressJwt({secret: config.jwtSecret}), RoleController.remove);

RoleRouter.param('roleId', RoleController.load);

export default RoleRouter;
