import mongoose from "mongoose";


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