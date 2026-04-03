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
/**
 * @desc    User Login Validation Schema
 * @description Ensures that login attempts provide both an email and a password 
 * before hitting the database, saving server resources.
 */
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});