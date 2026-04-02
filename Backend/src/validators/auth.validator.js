import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        "string.min": "Username kam se kam 3 characters ka hona chahiye",
        "any.required": "Username zaroori hai"
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Valid email address daalein"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password kam se kam 6 characters ka hona chahiye"
    }),
    role: Joi.string().valid("admin", "analyst", "viewer").default("viewer")
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});