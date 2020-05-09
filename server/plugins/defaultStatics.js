const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

module.exports = function defaultStatics(
  schema,
  options = { listPopulate: null, getPopulate: null }
) {
  // eslint-disable-next-line no-param-reassign
  schema.statics = {
    list({ skip = 0, limit = 50, filters = {} } = {}) {
      return this.find(filters)
        .populate(options.listPopulate)
        .sort({ createdAt: -1 })
        .skip(+skip)
        .limit(+limit)
        .exec();
    },
    get(id) {
      return this.findById(id)
        .populate(options.getPopulate)
        .exec()
        .then((model) => {
          if (model) {
            return model;
          }
          const err = new APIError(
            'No such model exists!',
            httpStatus.NOT_FOUND
          );
          return Promise.reject(err);
        });
    }
  };
};
