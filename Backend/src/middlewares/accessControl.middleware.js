import ErrorHandler from "../utils/errorHandler.js";

const ROLES_PERMISSIONS = {
    admin: ['create:record', 'read:record', 'update:record', 'delete:record', 'view:dashboard', 'manage:users'],
    analyst: ['read:record', 'view:dashboard'], 
    viewer: ['read:record']
};

export const authorize = (requiredPermission) => {
    return (req, res, next) => {
      if (!req.user) {
            return next(new ErrorHandler("Authentication required", 401));
        }
        // 1. Check if user is Active (Assignment Point #1)
        if (req.user.status !== 'active') {
            return next(new ErrorHandler("Access Denied: Your account is inactive", 403));
        }

        const userRole = req.user.role;
        const permissions = ROLES_PERMISSIONS[userRole] || [];

        // 2. Check if role has required permission (Assignment Point #4)
        if (!permissions.includes(requiredPermission)) {
            return next(new ErrorHandler(`Forbidden: ${userRole} role cannot perform this action`, 403));
        }
        next();
    };
};