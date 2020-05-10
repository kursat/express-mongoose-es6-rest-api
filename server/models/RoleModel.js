import httpStatus from 'http-status';
import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import {APIError} from '../helpers/APIError';
import blameable from '../plugins/blameable';

const RoleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id;

                delete ret.deleted;
                delete ret.__v;
                delete ret._id;
            },
        },
    },
);

RoleSchema.pre('save', async (next) => next());

RoleSchema.method({});

RoleSchema.statics = {
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

RoleSchema.plugin(mongooseDelete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: true,
    validateBeforeDelete: false,
});
RoleSchema.plugin(blameable);

export default mongoose.model('Role', RoleSchema);
