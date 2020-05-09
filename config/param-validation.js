const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().min(6).max(16).required(),
      roles: Joi.array().items(Joi.string()).required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  createLayout: {
    body: {
      layout: Joi.object().required()
    }
  },

  updateLayout: {
    body: {
      layout: Joi.object().required()
    }
  },

  updateRole: {},
  createRole: {},

  updatePermission: {},
  createPermission: {},

  createTree: {},
  updateTree: {},

  createLayerTree: {},
  updateLayerTree: {},

  createSource: {},
  updateSource: {},
};
