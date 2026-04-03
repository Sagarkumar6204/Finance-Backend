import express from "express";
import { getAllUsers, updateUserByAdmin, deleteUserByAdmin } from "../controllers/admin.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/accessControl.middleware.js";
/**
 * @desc    Admin Management Router
 * @description Provides administrative endpoints for user governance.
 * Includes capabilities for auditing all users, updating roles/status, and soft-deleting accounts.
 * * 🔒 Security: 
 * - Requires valid JWT (authenticate)
 * - Requires 'manage:users' permission (authorize)
 */
const adminRouter = express.Router();

adminRouter.use(authenticate, authorize('manage:users'));
/**
 * @route   GET /api/admin/all-users
 * @desc    Fetch list of all registered users (active, inactive, and soft-deleted).
 * @access  Private (Admin Only)
 */
adminRouter.get("/all-users", getAllUsers);
/**
 * @route   PUT /api/admin/user/:id
 * @desc    Update user details like Role or Status (Active/Inactive).
 * @access  Private (Admin Only)
 */
adminRouter.put("/user/:id", updateUserByAdmin);
/**
 * @route   DELETE /api/admin/user/:id
 * @desc    Soft-delete a user by marking 'isDeleted' as true.
 * @access  Private (Admin Only)
 */
adminRouter.delete("/user/:id", deleteUserByAdmin);

export default adminRouter;