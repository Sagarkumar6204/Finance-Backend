import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

// Force load .env from the root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
export const generateToken = (res, userId, role, name) => {
    // Check if secret exists
    const secret = process.env.JWT_SECRET;
   
    if (!secret) {
        console.error("JWT_SECRET is missing in .env file!");
    }

    const token = jwt.sign(
        { id: userId, role: role, username: name }, 
        secret , // Fallback for safety
        { expiresIn: "1d" } 
    );

    const cookieOptions = {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax", 
        maxAge: 24 * 60 * 60 * 1000, 
    };

    // res yahan zaroori hai cookie set karne ke liye
    res.cookie("token", token, cookieOptions);

    return token;
};