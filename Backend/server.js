import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/connectDB.js";


const PORT=process.env.PORT || 3000;
connectDB();
app.listen(PORT,()=>{
    console.log("server is running on PORT: ",PORT);
})