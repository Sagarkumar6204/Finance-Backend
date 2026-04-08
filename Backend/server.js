import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/connectDB.js";

connectDB();
/**
 * @constant {Number} PORT
 * @default 3000
 * @description The port on which the server will listen for incoming HTTP requests.
 */
const PORT=process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0',()=>{
    console.log("server is running on PORT: ",PORT);
})
