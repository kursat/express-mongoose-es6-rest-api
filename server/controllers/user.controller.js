const schemaFields = require('../helpers/schemaFields');
const { isAdmin } = require('../helpers/authHelpers');

const User = require('../models/user.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.loadedUser = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch((e) => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  if (isAdmin(req.keycloak)) {
    res.json(req.loadedUser);
  } else { res.status(401).send(); }
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User(req.body);

  user.blamableSave('req.keycloak.preferred_username')
    .then((savedUser) => res.json(savedUser))
    .catch((e) => {
      if (e.name === 'MongoError' && e.code === 11000) {
        // Duplicate username
        return res.status(400).send({ success: false, id: 'user-already-exist', message: 'User already exist!' });
      }
      return next(e);
    });
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.loadedUser;
  Object.assign(user, req.body);

  if (isAdmin(req.keycloak) || req.keycloak.preferred_username === req.loadedUser._id) {
    user.blamableSave(req.keycloak.preferred_username)
      .then((savedUser) => res.json(savedUser))
      .catch((e) => next(e));
  } else { res.status(401).send(); }
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0, ...filters } = req.query;

  Object.keys(filters).forEach((key) => {
    filters[key] = new RegExp(filters[key], 'i');
  });

  User.countDocuments(filters, (err, count) => {
    User.list({ limit, skip, filters })
      .then((users) => res.json(
        {
          count,
          results: users,
          fields: schemaFields(User.schema)
        }
      ))
      .catch((e) => next(e));
  });
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.loadedUser;
  if (isAdmin(req.keycloak)) {
    user.delete(req.keycloak.preferred_username)
      .then((deletedUser) => res.json(deletedUser))
      .catch((e) => next(e));
  } else { res.status(401).send(); }
}

module.exports = {
  load, get, create, update, list, remove
};
