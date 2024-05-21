"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Error response functions
const sendError = (err, req, res) => {
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
// Main error handling middleware
const globalErrorHandler = (err, req, res, 
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    sendError(err, req, res);
};
// Export the middleware
exports.default = globalErrorHandler;
