const expressJwt = require('express-jwt');
const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const userCtrl = require('../controllers/user.controller');
const config = require('../../config/config');

const userRouter = express.Router(); // eslint-disable-line new-cap

userRouter.route('/')
  /** GET /api/users - Get list of users */
  .get(expressJwt({ secret: config.jwtSecret }), userCtrl.list)

  /** POST /api/users - Create new user */
  .post(
    [
      // expressJwt({ secret: config.jwtSecret }),
      validate(paramValidation.createUser)
    ],
    userCtrl.create
  );

userRouter.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(expressJwt({ secret: config.jwtSecret }), userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(
    [
      expressJwt({ secret: config.jwtSecret }),
      validate(paramValidation.updateUser)
    ],
    userCtrl.update
  )

  /** DELETE /api/users/:userId - Delete user */
  .delete(expressJwt({ secret: config.jwtSecret }), userCtrl.remove);

/** Load user when API with userId route parameter is hit */
userRouter.param('userId', userCtrl.load);

module.exports = {
  userRouter
};
