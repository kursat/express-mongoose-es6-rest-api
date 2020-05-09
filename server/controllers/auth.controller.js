const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/config');
const User = require('../models/user.model');
const { getUserRoles } = require('../helpers/authHelpers');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {
  try {
    const user = await User.findOne({
      username: req.body.username
    }).populate({
      path: 'roles',
    });

    const result = await bcrypt.compare(req.body.password, user.password);

    if (result) {
      const token = jwt.sign({
        username: user.username,
        _id: user._id,
        roles: getUserRoles(user.roles),
      }, config.jwtSecret);

      return res.json({
        token,
        user
      });
    }
    // eslint-disable-next-line no-empty
  } catch (e) {
  }

  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  return next(err);
}

module.exports = { login };
