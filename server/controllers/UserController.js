import schemaFields from '../helpers/schemaFields';
import UserModel from '../models/UserModel';

export default class UserController {
	/**
	 * Load user and append to req.
	 */
	static load(req, res, next, id) {
		UserModel.get(id)
			.then((user) => {
				req.loadedUser = user; // eslint-disable-line no-param-reassign
				return next();
			})
			.catch((e) => next(e));
	}

	/**
	 * Get user
	 * @returns {UserModel}
	 */
	static get(req, res) {
		res.json(req.loadedUser);
	}

	/**
	 * Create new user
	 * @property {string} req.body.username - The username of user.
	 * @property {string} req.body.mobileNumber - The mobileNumber of user.
	 * @returns {UserModel}
	 */
	static create(req, res, next) {
		const user = new UserModel(req.body);

		user.blameableSave(req.user ? req.user.username : 'unknown')
			.then((savedUser) => res.json(savedUser))
			.catch((e) => {
				if (e.name === 'MongoError' && e.code === 11000) {
					// Duplicate username
					return res.status(400).send({
						success: false,
						id: 'user-already-exist',
						message: 'User already exist!',
					});
				}
				return next(e);
			});
	}

	/**
	 * Update existing user
	 * @property {string} req.body.username - The username of user.
	 * @property {string} req.body.mobileNumber - The mobileNumber of user.
	 * @returns {UserModel}
	 */
	static update(req, res, next) {
		const user = req.loadedUser;
		Object.assign(user, req.body);

		user.blameableSave(req.user ? req.user.username : 'unknown')
			.then((savedUser) => res.json(savedUser))
			.catch((e) => next(e));
	}

	/**
	 * Get user list.
	 * @property {number} req.query.skip - Number of users to be skipped.
	 * @property {number} req.query.limit - Limit number of users to be returned.
	 * @returns {UserModel[]}
	 */
	static list(req, res, next) {
		const {limit = 50, skip = 0, ...filters} = req.query;

		Object.keys(filters).forEach((key) => {
			filters[key] = new RegExp(filters[key], 'i');
		});

		UserModel.countDocuments(filters, (err, count) => {
			UserModel.list({limit, skip, filters})
				.then((users) =>
					res.json({
						count,
						results: users,
						fields: schemaFields(UserModel.schema),
					}),
				)
				.catch((e) => next(e));
		});
	}

	/**
	 * Delete user.
	 * @returns {UserModel}
	 */
	static remove(req, res, next) {
		const user = req.loadedUser;
		user.delete(req.user ? req.user.username : 'unknown')
			.then((deletedUser) => res.json(deletedUser))
			.catch((e) => next(e));
	}
}
