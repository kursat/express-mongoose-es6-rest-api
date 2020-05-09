const expressJwt = require('express-jwt');
const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const roleCtrl = require('../controllers/role.controller');
const config = require('../../config/config');

// eslint-disable-next-line new-cap
const roleRouter = express.Router();

roleRouter.route('/')
  .get(expressJwt({ secret: config.jwtSecret }), roleCtrl.list)
  .post(
    [
      expressJwt({ secret: config.jwtSecret }),
      validate(paramValidation.createRole)
    ],
    roleCtrl.create
  );

roleRouter.route('/:roleId')
  .get(expressJwt({ secret: config.jwtSecret }), roleCtrl.get)
  .put(
    [
      expressJwt({ secret: config.jwtSecret }),
      validate(paramValidation.updateRole)
    ],
    roleCtrl.update
  )
  .delete(expressJwt({ secret: config.jwtSecret }), roleCtrl.remove);

roleRouter.param('roleId', roleCtrl.load);

module.exports = {
  roleRouter
};
