import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import catchAsync from "../utils/catchAsync.js"; 
import ErrorHandler from "../utils/errorHandler.js"; 

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerController = catchAsync(async (req, res, next) => {
    const { username, email, password} = req.body;

    if (!username || !email || !password) {
        
        return next(new ErrorHandler("Please provide username, email, and password.", 400));
    }


    const userExists = await UserModel.findOne({ email });
    if (userExists) {
        if (userExists.status === 'inactive' || userExists.isDeleted) {
            return next(new ErrorHandler("Account deactivated hai. Admin se sampark karein.", 403));
        }
        return next(new ErrorHandler("User already exists with this email", 400));
    }

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        role: "viewer" // Default role
    });

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: { id: user._id, username: user.username, role: user.role }
    });
});

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginController = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

   
    const user = await UserModel.findOne({ email }).select("+password");
     if (user.status === 'inactive' || user.isDeleted) {
            return next(new ErrorHandler("Account deactivated hai. Admin se sampark karein.", 403));
        }
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
if (user.status === 'inactive') {
    return next(new ErrorHandler("Tera account block hai! Admin se baat kar.", 403));
}

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const token = generateToken(res, user._id, user.role, user.username);


    return res.status(200).json({
        success: true,
        token,
        message: "Logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            role: user.role
        }
    });
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logoutController = catchAsync(async (req, res, next) => {
   return res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "Logged out successfully"
    });
});