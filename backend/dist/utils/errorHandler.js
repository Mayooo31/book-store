"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong. Please try again later! ";
    return res.status(errorStatus).json({
        success: false,
        message: errorMessage,
        status: errorStatus,
    });
};
exports.default = errorHandler;
