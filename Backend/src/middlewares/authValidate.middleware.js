// src/middlewares/authValidate.middleware.js
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