import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username : { 
    type: String, 
    required: [true, "Name is required"], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true, 
    lowercase: true,
    trim: true,
    index: true // Email par indexing login fast karegi
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    select: false 
  },
  role: { 
    type: String, 
    enum: ['admin', 'analyst', 'viewer'], 
    default: 'viewer' 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  isDeleted: { type: Boolean, default: false } // Soft delete logic
}, { timestamps: true });

const UserModel= mongoose.model('User', userSchema);
export default UserModel;