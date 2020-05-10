import schemaFields from '../helpers/schemaFields';
import RoleModel from '../models/RoleModel';

export default class RoleController {
	static load(req, res, next, id) {
		RoleModel.get(id)
			.then((role) => {
				req.loadedRole = role; // eslint-disable-line no-param-reassign
				return next();
			})
			.catch((e) => next(e));
	}

	static get(req, res) {
		res.json(req.loadedRole);
	}

	static create(req, res, next) {
		const role = new RoleModel(req.body);

		role.blameableSave(req.user ? req.user.username : 'unknown')
			.then((savedRole) => res.json(savedRole))
			.catch((e) => next(e));
	}

	static update(req, res, next) {
		const role = req.loadedRole;
		Object.assign(role, req.body);

		role.blameableSave(req.user ? req.user.username : 'unknown')
			.then((savedRole) => res.json(savedRole))
			.catch((e) => next(e));
	}

	static list(req, res, next) {
		const {limit = 50, skip = 0, ...filters} = req.query;

		Object.keys(filters).forEach((key) => {
			filters[key] = new RegExp(filters[key], 'i');
		});

		RoleModel.countDocuments(filters, (err, count) => {
			RoleModel.list({limit, skip, filters})
				.then((roles) =>
					res.json({
						count,
						results: roles,
						fields: schemaFields(RoleModel.schema),
					}),
				)
				.catch((e) => next(e));
		});
	}

	static remove(req, res, next) {
		const role = req.loadedRole;

		role.delete(req.user ? req.user.username : 'unknown')
			.then((deletedRole) => res.json(deletedRole))
			.catch((e) => next(e));
	}
}
