/**
 * @desc    Global Async Error Wrapper (HOC)
 * @description A Higher-Order Function (HOF) that catches errors in asynchronous 
 * Express routes and passes them to the global error-handling middleware.
 * - Eliminates the need for repetitive try-catch blocks in every controller.
 * - Ensures that even if an async operation fails, the 'next()' function is called with the error.
 * * @param   {Function} fn - The asynchronous controller function to be wrapped.
 * @returns {Function} - A standard Express middleware function (req, res, next).
 * * @example
 * export const myController = catchAsync(async (req, res, next) => {
 * const data = await Model.find(); // No try-catch needed here!
 * res.status(200).json(data);
 * });
 */
export default (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};