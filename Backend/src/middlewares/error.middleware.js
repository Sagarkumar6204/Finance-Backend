/**
 * @desc    Global Error Handling Middleware
 * @description Centralized error handler that catches all errors passed via next().
 * It standardizes error responses and handles specific database-related exceptions:
 * 1. CastError: Handles invalid MongoDB ObjectIds.
 * 2. DuplicateKeyError (11000): Handles unique constraint violations (e.g., same email).
 * 3. Default: Fallback to 500 Internal Server Error.
 * * @param   {Object} err - Error object containing statusCode and message.
 * @param   {Object} req - Express request object.
 * @param   {Object} res - Express response object.
 * @param   {Function} next - Express next function.
 * @returns {Object} JSON response with success:false and the error message.
 */

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong MongoDB ID Error (Cast Error)
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err.message = message;
        err.statusCode = 400;
    }

    // Duplicate Key Error (Jaise same email se register karna)
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err.message = message;
        err.statusCode = 400;
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default errorMiddleware;