import jwt_decode from 'jwt-decode'; // eslint-disable-line camelcase

export const authorizationToken = () =>
    sessionStorage.token;

export const setAuthorizationToken = token => {
    sessionStorage.token = token;
};

export const logout = () =>
	setAuthorizationToken('');

export const checkAuthorization = (nextState, replace) => {
    if (!authorizationToken()) {
        const redirect = encodeURIComponent(nextState.location.pathname);
        replace(`/login?redirect=${redirect}`);
    }
};

export const usersRole = () => {
	// WARNING: This doesn't verify the signature (as the front-end can't
	// securely contain the signing secret).
    const token = jwt_decode(authorizationToken());
    return token && token.role;
};

export let roles = [];

export let permissions = {};

export const addRolesAndPermissions = (appRoles, appPermissions) => {
    roles = appRoles;
    permissions = appPermissions;
};

const roleIndex = role =>
    roles.findIndex(item => item === role);

export const hasPermission = (permission) => {
    const index = roleIndex(usersRole());
    return (index > -1) && permission && (permissions[permission][index] === 'Y');
};
