const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong MongoDB ID Error (Cast Error)
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err.message = message;
        err.statusCode = 400;
    }

    // Duplicate Key Error (Jaise same email se register karna)
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err.message = message;
        err.statusCode = 400;
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default errorMiddleware;