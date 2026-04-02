import express from "express";
import { getAllUsers, updateUserByAdmin, deleteUserByAdmin } from "../controllers/admin.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/accessControl.middleware.js";
const adminRouter = express.Router();

adminRouter.use(authenticate, authorize('manage:users'));

adminRouter.get("/all-users",authenticate,authorize('manage:users'), getAllUsers);
adminRouter.put("/user/:id", authenticate, authorize('manage:users'), updateUserByAdmin);
adminRouter.delete("/user/:id", authenticate, authorize('manage:users'), deleteUserByAdmin);

export default adminRouter;