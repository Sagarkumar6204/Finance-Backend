import mongoose from "mongoose";
/**
 * @typedef {Object} User
 * @property {String} username - Full name or display name of the user.
 * @property {String} email - Unique identifier for login (indexed for speed).
 * @property {String} password - Hashed password (hidden by default in queries).
 * @property {String} role - Access level: 'admin', 'analyst', or 'viewer'.
 * @property {String} status - Account state: 'active' or 'inactive'.
 * @property {Boolean} isDeleted - Flag for Soft Delete mechanism.
 */

/**
 * @desc    Mongoose schema for User Identity and Access Management (IAM).
 * Features:
 * - Security: 'select: false' on password to prevent accidental exposure.
 * - Performance: Indexing on email for O(1) lookups during authentication.
 * - Soft Delete: 'isDeleted' flag to maintain data integrity for financial audits.
 */
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