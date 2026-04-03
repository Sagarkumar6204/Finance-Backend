import ErrorHandler from "../utils/errorHandler.js";

/**
 * @constant {Object} ROLES_PERMISSIONS
 * @description Defines a mapping of user roles to their specific allowed actions.
 * - admin: Full system access (CRUD + Dashboard + User Management)
 * - analyst: Read-only access to global records and dashboard insights.
 * - viewer: Personal record access and personal dashboard summary.
 */
const ROLES_PERMISSIONS = {
    admin: ['create:record', 'read:record', 'update:record', 'delete:record', 'view:dashboard', 'manage:users'],
    analyst: ['read:record', 'view:dashboard'], 
    viewer: ['read:record', 'view:dashboard']
};

/**
 * @desc    Middleware to authorize users based on assigned permissions and account status.
 * @param   {String} requiredPermission - The specific permission string required to access a route.
 * @returns {Function} - Express middleware function to validate access.
 * * @example
 * router.post("/add", authenticate, authorize('create:record'), createTransaction);
 */
export const authorize = (requiredPermission) => {
    return (req, res, next) => {
      if (!req.user) {
            return next(new ErrorHandler("Authentication required", 401));
        }
       
        if (req.user.status !== 'active') {
            return next(new ErrorHandler("Access Denied: Your account is inactive", 403));
        }

        const userRole = req.user.role;
        const permissions = ROLES_PERMISSIONS[userRole] || [];

        
        if (!permissions.includes(requiredPermission)) {
            return next(new ErrorHandler(`Forbidden: ${userRole} role cannot perform this action`, 403));
        }
        next();
    };
};