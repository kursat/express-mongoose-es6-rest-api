import joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: joi.string().required(),
      password: joi.string().min(6).max(16).required(),
      roles: joi.array().items(joi.string()).required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
    },
    params: {
      userId: joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: joi.string().required(),
      password: joi.string().required()
    }
  },

  updateRole: {},
  createRole: {},
};
