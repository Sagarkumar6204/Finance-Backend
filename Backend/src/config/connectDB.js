import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
/**
 * @function connectDB
 * @async
 * @description Establishes a connection between the Node.js application and MongoDB using Mongoose.
 * 🛡️ Robustness Features:
 * 1. Environment Validation: Checks if MONGODB_URI is present before attempting connection.
 * 2. Error Handling: Catches connection strings issues or network failures.
 * 3. Process Management: Terminates the application if the database is unreachable (Fail-fast strategy).
 * * @throws {Error} - If MONGODB_URI is missing from the environment variables.
 * @returns {Promise<void>} - Resolves when the connection is successfully established.
 *//**
 * @function connectDB
 * @async
 * @description Establishes a connection between the Node.js application and MongoDB using Mongoose.
 * 🛡️ Robustness Features:
 * 1. Environment Validation: Checks if MONGODB_URI is present before attempting connection.
 * 2. Error Handling: Catches connection strings issues or network failures.
 * 3. Process Management: Terminates the application if the database is unreachable (Fail-fast strategy).
 * * @throws {Error} - If MONGODB_URI is missing from the environment variables.
 * @returns {Promise<void>} - Resolves when the connection is successfully established.
 */
export async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;
        
        
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in .env file. Check your file name or path.");
        }

        await mongoose.connect(uri);
        console.log("Connected to DB :)");
        seedAdmin();
    } catch (error) {
        console.error("Error connecting to DB:", error.message);
        process.exit(1); // Production standard: DB nahi toh server band
    }
} 
/**
 * @function seedAdmin
 * @description Checks if an Admin user exists in the database. If not, it creates a default Admin account with credentials specified in environment variables.
 *  Security Measures:
 * 1. Password Hashing: Admin password is securely hashed using bcrypt before storage.
 * 2. Environment Variables: Admin credentials are sourced from environment variables to avoid hardcoding sensitive information.
 */
const seedAdmin = async () => {
    try {
        const adminExists = await UserModel.findOne({ role: 'admin' });

        if (!adminExists) {
            console.log(" Initializing Database Seeding: Creating Master Admin...");
            const password = process.env.ADMIN_PASSWORD; 
            await UserModel.create({
                username: "Admin",
                email: "admin@gmail.com", 
                password: await bcrypt.hash(password, 10),
                role: "admin"
            });

        } else {
            console.log(" System Health: Admin account already verified.");
        }
    } catch (error) {
        console.error(" Seeding Failed:", error.message);
    }
};