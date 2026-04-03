/**
 * @class   ErrorHandler
 * @extends Error
 * @description A custom error utility class designed to standardize error objects 
 * across the entire application. It allows attaching a specific HTTP status code 
 * to a standard JavaScript Error.
 * * * 🚀 Key Features:
 * - Custom Status Codes: Easily distinguish between 400 (Bad Request), 401 (Unauthorized), etc.
 * - Stack Trace Capture: Pinpoints the exact line of code where the error originated.
 * - Integration: Works seamlessly with the Global Error Middleware.
 */

class ErrorHandler extends Error {
    /**
     * @constructor
     * @param {String} message - The human-readable error description.
     * @param {Number} statusCode - The HTTP status code associated with the error.
     */
    constructor(message, statusCode) {
        super(message);
        /**
         * @property {Number} statusCode
         * Attaching the HTTP status code to the error instance.
         */
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default ErrorHandler;