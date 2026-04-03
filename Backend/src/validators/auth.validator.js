import Joi from "joi";
/**
 * @desc    User Registration Validation Schema
 * @description Validates the payload for new user signups.
 * - Username: Must be between 3 and 30 characters.
 * - Email: Must be a properly formatted email string.
 * - Password: Minimum length of 6 characters for basic security.
 * - Role: Restricted to 'admin', 'analyst', or 'viewer' (defaults to 'viewer').
 */
export const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        "string.min": "Required at least 3 characters for username",
        "any.required": "Username is required"
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required"
    }),
    role: Joi.string().valid("admin", "analyst", "viewer").default("viewer")
});
/**
 * @desc    User Login Validation Schema
 * @description Ensures that login attempts provide both an email and a password 
 * before hitting the database, saving server resources.
 */
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});