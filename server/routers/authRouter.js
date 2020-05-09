const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const authCtrl = require('../controllers/auth.controller');

const authRouter = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
authRouter.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

module.exports = {
  authRouter
};
