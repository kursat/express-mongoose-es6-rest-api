const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const bcrypt = require('bcrypt');
const blamable = require('../plugins/blamable');
const defaultStatics = require('../plugins/defaultStatics');

const SALT_WORK_FACTOR = 10;
/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true },
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    }
  ],
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  password: { type: String, required: true },
}, {
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
    }
  }
});

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
  }
});

UserSchema.plugin(defaultStatics, {
  getPopulate: {
    path: 'roles'
  }
});
UserSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  validateBeforeDelete: false
});
UserSchema.plugin(blamable);

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
