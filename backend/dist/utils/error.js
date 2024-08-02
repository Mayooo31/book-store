"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
const createError = (status, message) => {
    return new CustomError(status, message);
};
exports.default = createError;
