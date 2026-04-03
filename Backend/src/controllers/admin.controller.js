import UserModel from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import ErrorHandler from "../utils/errorHandler.js";


/**
 * @desc    Get all registered users (Admin Only)
 * @route   GET /api/admin/all-users
 * @access  Private/Admin
 */
export const getAllUsers = catchAsync(async (req, res, next) => {
    // Sabhi users ko fetch karo (par password nahi)
    const users = await UserModel.find();
    
    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

/**
 * @desc    Update user role or status (Admin Only)
 * @route   PUT /api/admin/user/:id
 * @access  Private/Admin
 * @param   {Object} req - Request containing {role, status} in body
 * @param   {Object} res - Express response object
 * @param   {Function} next - Error handler
 */
export const updateUserByAdmin = catchAsync(async (req, res, next) => {
    const { role, status } = req.body; 
    const { id } = req.params;
    
    if (id === req.user._id.toString()) {
        return next(new ErrorHandler("You cannot update your own admin account!", 400));
    }
    // User ko dhoondo aur update karo
    const user = await UserModel.findByIdAndUpdate(
        id, 
        { role, status }, 
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new ErrorHandler("User nahi mila!", 404));
    }

    res.status(200).json({ 
        success: true, 
        message: `User ${user.username} is now ${user.role} and ${user.status}`, 
        user 
    });
});

/**
 * @desc    Soft delete/Deactivate user (Admin Only)
 * @route   DELETE /api/admin/user/:id
 * @access  Private/Admin
 * @param   {Object} req - Request containing user ID in params
 */
export const deleteUserByAdmin = catchAsync(async (req, res, next) => {
    
    const { id } = req.params;
    if (id === req.user._id.toString()) {
        return next(new ErrorHandler("You cannot delete your own admin account!", 400));
    }
    const user = await UserModel.findById(id);


    if (!user) return next(new ErrorHandler("User not found", 404));

    // Isse user DB se gayab nahi hoga, bas login nahi kar payega
    user.status = 'inactive';
    user.isDeleted = true;
    await user.save();

    res.status(200).json({ 
        success: true, 
        message: "User has been deactivated/deleted by Admin" 
    });
});