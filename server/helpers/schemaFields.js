const { objectFromEntries } = require('../helpers/objectFromEntries');

const forbiddenFields = ['_id', '__v', 'deleted', 'password'];

const schemaFields = (schema) => {
  const pairs = Object.keys(schema.paths)
    .filter((key) => !forbiddenFields.includes(key))
    .map((key) => [key, schema.paths[key].instance.toLowerCase()]);

  return objectFromEntries(pairs);
};

module.exports = schemaFields;
