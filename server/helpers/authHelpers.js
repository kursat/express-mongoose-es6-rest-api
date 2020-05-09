const getUserRoles = (keycloak) => {
  try {
    const realmRoles = keycloak.realm_access.roles;
    const clientRoles = keycloak.resource_access.MRKAY
      ? keycloak.resource_access.MRKAY.roles
      : [];

    return [
      ...realmRoles,
      ...clientRoles,
    ];
  } catch (e) {
    return [];
  }
};

const isAdmin = (keycloak) => {
  try {
    return keycloak.realm_access.roles.includes('SuperAdmin');
  } catch (e) {
    return false;
  }
};

module.exports = {
  getUserRoles,
  isAdmin,
};
