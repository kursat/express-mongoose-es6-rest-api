import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import {APIError} from '../helpers/APIError';
import blameable from '../plugins/blameable';

const SALT_WORK_FACTOR = 10;
/**
 * User Schema
 */
const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			index: {unique: true},
		},
		roles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Role',
			},
		],
		email: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		surname: {
			type: String,
			required: true,
		},
		password: {type: String, required: true},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform(doc, ret) {
				ret.id = ret._id;

				// ret.roles = ret.roles.map(r => r.name);
				// ret.permissions = ret.permissions.map(p => p.name);

				delete ret.deleted;
				delete ret.password;
				delete ret.__v;
				delete ret._id;
			},
		},
	},
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

UserSchema.pre('save', async function save(next) {
	if (!this.isModified('password')) return next();
	try {
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		this.password = await bcrypt.hash(this.password, salt);
		return next();
	} catch (err) {
		return next(err);
	}
});

/**
 * Methods
 */
UserSchema.method({
	validatePassword: async function validatePassword(data) {
		return bcrypt.compare(data, this.password);
	},
});

UserSchema.statics = {
	list({skip = 0, limit = 50, filters = {}} = {}) {
		return this.find(filters)
			.sort({createdAt: -1})
			.skip(+skip)
			.limit(+limit)
			.exec();
	},
	get(id) {
		return this.findById(id)
			.exec()
			.then((model) => {
				if (model) {
					return model;
				}
				const err = new APIError(
					'No such model exists!',
					httpStatus.NOT_FOUND,
				);
				return Promise.reject(err);
			});
	},
};

UserSchema.plugin(mongooseDelete, {
	deletedAt: true,
	deletedBy: true,
	overrideMethods: true,
	validateBeforeDelete: false,
});
UserSchema.plugin(blameable);

export default mongoose.model('User', UserSchema);
