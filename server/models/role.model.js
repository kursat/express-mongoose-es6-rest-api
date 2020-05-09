const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const blamable = require('../plugins/blamable');
const defaultStatics = require('../plugins/defaultStatics');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;

      delete ret.deleted;
      delete ret.__v;
      delete ret._id;
    }
  }
});

RoleSchema.pre('save', async (next) => next());

RoleSchema.method({});

RoleSchema.plugin(defaultStatics);
RoleSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: true,
  validateBeforeDelete: false
});
RoleSchema.plugin(blamable);

module.exports = mongoose.model('Role', RoleSchema);
