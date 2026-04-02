import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const authenticate = async (req, res, next) => {
  try {
    let token;

    // 1. Token nikalne ka sahi tarika (Cookie ya Header dono se)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token; // ✅ Direct value lo, destructure mat karo
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "You are not logged in! Please login to get access." 
      });
    }

    // 2. Token ko verify karo
    // Note: Agar process.env.JWT_SECRET abhi bhi undefined aa raha hai, 
    // toh yahan hardcoded string daal kar check karo temporary: "your_secret"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. User ko dhoondo
    const currentUser = await UserModel.findById(decoded.id);
    
    if (!currentUser) {
      return res.status(401).json({ 
        success: false, 
        message: "The user belonging to this token no longer exists." 
      });
    }

    // 4. Sab sahi hai! User data req.user mein daal do
    req.user = currentUser;
    next();
  } catch (error) {
    console.error("JWT Auth Error:", error.message);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

export default authenticate;