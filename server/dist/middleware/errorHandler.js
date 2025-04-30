"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.errorHandler = exports.notFound = exports.ApiError = void 0;
// Interface for ApiError to extend the Error class
class ApiError extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
// Not found error handler - to be used when route is not found
const notFound = (req, res, next) => {
    const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
// Global error handler
const errorHandler = (err, req, res, next) => {
    // Check if error is an instance of ApiError
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || 'Something went wrong';
    const errors = err instanceof ApiError ? err.errors : undefined;
    // Log error for server-side debugging
    console.error(`[ERROR] ${statusCode} - ${message}`);
    if (err.stack) {
        console.error(err.stack);
    }
    // Send standardized error response
    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
exports.errorHandler = errorHandler;
// Helper function to create errors in controllers
const createError = (message, statusCode, errors) => {
    return new ApiError(message, statusCode, errors);
};
exports.createError = createError;
//# sourceMappingURL=errorHandler.js.map