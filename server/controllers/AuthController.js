import {compare} from 'bcrypt';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import {APIError} from '../helpers/APIError';
import {getUserRoles} from '../helpers/authHelpers';

import UserModel from '../models/UserModel';

export default class AuthController {
	/**
	 * Returns jwt token if valid username and password is provided
	 * @param req
	 * @param res
	 * @param next
	 * @returns {*}
	 */
	static async login(req, res, next) {
		try {
			const user = await UserModel.findOne({
				email: req.body.email,
			}).populate({
				path: 'roles',
			});

			const result = await compare(req.body.password, user.password);

			if (result) {
				const token = jwt.sign(
					{
						email: user.email,
						_id: user._id,
						roles: getUserRoles(user.roles),
					},
					config.jwtSecret,
				);

				return res.json({
					token,
					user,
				});
			}
			// eslint-disable-next-line no-empty
		} catch (e) {}

		const err = new APIError(
			'Authentication error',
			httpStatus.UNAUTHORIZED,
			true,
		);
		return next(err);
	}
}
