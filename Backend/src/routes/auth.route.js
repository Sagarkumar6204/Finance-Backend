import express from "express";
import { loginController, logoutController, registerController } from "../controllers/auth.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/authValidate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

/**
 * @desc    Authentication Router
 * @description Handles all identity-related operations including user registration, 
 * secure login, and session termination. 
 * * Security Features:
 * - Request Body Validation: Powered by Joi schemas.
 * - Role Management: Defaults to 'viewer' via Controller logic.
 * - JWT Session Handling: Secure logout requires a valid token.
 */
const authRouter=express.Router();
/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and initiate session (returns JWT).
 * @access  Public
 * @control validate(loginSchema) - Prevents malformed login attempts.
 */
authRouter.post("/login",validate(loginSchema),loginController);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user in the system.
 * @access  Public (Self-registration)
 * @control validate(registerSchema) - Ensures data integrity before processing.
 */
authRouter.post("/register",validate(registerSchema),registerController);

/**
 * @route   POST /api/auth/logout
 * @desc    Invalidate user session and clear authentication cookies.
 * @access  Private (Requires valid JWT)
 */
authRouter.post("/logout",authenticate,logoutController);

export default authRouter;