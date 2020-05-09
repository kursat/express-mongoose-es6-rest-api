const Role = require('../models/role.model');
const schemaFields = require('../helpers/schemaFields');
const { isAdmin } = require('../helpers/authHelpers');

function load(req, res, next, id) {
  Role.get(id)
    .then((role) => {
      req.loadedRole = role; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch((e) => next(e));
}

function get(req, res) {
  res.json(req.loadedRole);
}

function create(req, res, next) {
  if (isAdmin(req.keycloak)) {
    const role = new Role(req.body);

    role.blamableSave(req.keycloak.preferred_username)
      .then((savedRole) => res.json(savedRole))
      .catch((e) => next(e));
  } else {
    res.status(401).send();
  }
}

function update(req, res, next) {
  const role = req.loadedRole;
  Object.assign(role, req.body);

  if (isAdmin(req.keycloak)) {
    role.blamableSave(req.keycloak.preferred_username)
      .then((savedRole) => res.json(savedRole))
      .catch((e) => next(e));
  } else {
    res.status(401).send();
  }
}

function list(req, res, next) {
  const { limit = 50, skip = 0, ...filters } = req.query;

  Object.keys(filters).forEach((key) => {
    filters[key] = new RegExp(filters[key], 'i');
  });

  if (isAdmin(req.keycloak)) {
    Role.countDocuments(filters, (err, count) => {
      Role.list({ limit, skip, filters })
        .then((roles) => res.json(
          {
            count,
            results: roles,
            fields: schemaFields(Role.schema)
          }
        ))
        .catch((e) => next(e));
    });
  } else {
    res.status(401).send();
  }
}

function remove(req, res, next) {
  const role = req.loadedRole;
  if (isAdmin(req.keycloak)) {
    role.delete(req.keycloak.preferred_username)
      .then((deletedRole) => res.json(deletedRole))
      .catch((e) => next(e));
  } else {
    res.status(401).send();
  }
}

module.exports = {
  load, get, create, update, list, remove
};
