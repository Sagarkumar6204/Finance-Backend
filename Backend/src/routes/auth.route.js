import express from "express";
import { loginController, logoutController, registerController } from "../controllers/auth.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/authValidate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
const authRouter=express.Router();
authRouter.post("/login",validate(loginSchema),loginController);
authRouter.post("/register",validate(registerSchema),registerController);
authRouter.post("/logout",authenticate,logoutController);

export default authRouter;