import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
/**
 * @desc    JWT Generation & Cookie Management Utility
 * @description Generates a signed JSON Web Token and attaches it to the 
 * HTTP response as a secure, HTTP-only cookie.
 * * 🛡️ Security Features:
 * - HTTP-Only: Prevents client-side scripts from accessing the token (XSS Protection).
 * - Secure Flag: Ensures cookies are only sent over HTTPS in production.
 * - SameSite 'Lax': Balances security and usability for cross-site requests.
 * * @param {Object} res - Express response object to set the cookie.
 * @param {String} userId - The MongoDB unique ID of the user.
 * @param {String} role - The assigned role (admin/analyst/viewer).
 * @param {String} name - The username for quick client-side access.
 * @returns {String} - The generated JWT token string.
 */

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
export const generateToken = (res, userId, role, name) => {
    
    const secret = process.env.JWT_SECRET;
   
    if (!secret) {
        console.error("JWT_SECRET is missing in .env file!");
    }

    const token = jwt.sign(
        { id: userId, role: role, username: name }, 
        secret , 
        { expiresIn: "1d" } 
    );

    const cookieOptions = {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "none", //use "lax" for development
        maxAge: 24 * 60 * 60 * 1000, 
    };

    
    res.cookie("token", token, cookieOptions);

    return token;
};