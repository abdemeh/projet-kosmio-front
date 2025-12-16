// Règles d’accès selon rôle

export const ROLES = {
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
    EXPERT_CO2: 'EXPERT_CO2',
    UTILISATEUR: 'UTILISATEUR',
};

export const PERMISSIONS = {
    ADMIN: ['publish'],
    SUPER_ADMIN: ['create', 'update', 'validate', 'publish', 'delete'],
    EXPERT_CO2: ['validate'],
    UTILISATEUR: ['create', 'update'],
};

export const fakeUsers = { //à enlever en prod
    admin: {
        id:1,
        name: 'admin user',
        role: ROLES.ADMIN,
    },
    super_admin: {
        id:1,
        name: 'super_admin user',
        role: ROLES.SUPER_ADMIN,
    },
    expert_co2: {
        id:1,
        name: 'expert_co2 user',
        role: ROLES.EXPERT_CO2,
    },
    utilisateur: {
        id:1,
        name: 'utilisateur user',
        role: ROLES.UTILISATEUR,
    },
};

export const canPerformAction = (role, action) => {
    if (!role) return false;
    return PERMISSIONS[role]?.includes(action);
};