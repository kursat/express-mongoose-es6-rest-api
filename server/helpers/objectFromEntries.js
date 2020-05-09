const objectFromEntries = (arr) => arr.reduce(
  (acc, i) => ({
    ...acc,
    [i[0]]: i[1],
  }),
  {},
);

module.exports = { objectFromEntries };
