const accessLevels = {
  NO_PERMISSION: 1,
  READ_ONLY: 2,
  ALL_PERMISSIONS: 3,
};

const compareAccesslevel = (item1, item2) => {
  const accessLevel1 = accessLevels[item1.accessLevel];
  const accessLevel2 = accessLevels[item2.accessLevel];
  return accessLevel1 > accessLevel2;
};

const mergePermissions = (records) => {
  const appPermissions = [];
  const sourcePermissions = [];

  records.forEach((record) => {
    record.appPermissions.forEach((permission) => {
      const prev = appPermissions.find((p) => p.name === permission.name);

      if (!prev) {
        appPermissions.push(permission);
      } else if (compareAccesslevel(permission, prev)) {
        prev.accessLevel = permission.accessLevel;
      }
    });

    record.sourcePermissions.forEach((permission) => {
      const prev = sourcePermissions.find((p) => p.source.id === permission.source.id);

      if (!prev) {
        sourcePermissions.push(permission);
      } else if (compareAccesslevel(permission, prev)) {
        prev.accessLevel = permission.accessLevel;
      }
    });
  });

  return {
    appPermissions,
    sourcePermissions,
  };
};

module.exports = {
  mergePermissions,
};
