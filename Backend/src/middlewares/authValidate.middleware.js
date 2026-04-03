/**
 * @desc    Global Request Validation Middleware
 * @description A Higher-Order Function (HOF) that takes a Joi schema and returns 
 * an Express middleware to validate the request body.
 * 1. Validates 'req.body' against the provided Joi schema.
 * 2. Collects all validation errors (does not stop at the first one).
 * 3. Sanitizes and updates 'req.body' with validated/formatted values.
 * * @param   {Object} schema - The Joi schema object used for validation.
 * @returns {Function} - An Express middleware function (req, res, next).
 * * @example
 * router.post("/register", validate(registerSchema), registerController);
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
        abortEarly: false, 
        
    });
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message);
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: errorMessage
        });
    }
    req.body = value;
    next();
};

export default validate;