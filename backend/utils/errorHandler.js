"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandler = function (err, req, res, next) {
    var errorStatus = err.status || 500;
    var errorMessage = err.message || "Something went wrong. Please try again later! ";
    return res.status(errorStatus).json({
        success: false,
        message: errorMessage,
        status: errorStatus,
    });
};
exports.default = errorHandler;
