import mongoose from "mongoose";

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
        
        // Debugging ke liye check: Kya URI mil rahi hai?
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in .env file. Check your file name or path.");
        }

        await mongoose.connect(uri);
        console.log("Connected to DB :)");
    } catch (error) {
        console.error("Error connecting to DB:", error.message);
        process.exit(1); // Production standard: DB nahi toh server band
    }
} 