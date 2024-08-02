"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyIsUserAdmin = exports.verifyToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
// utils
var error_1 = __importDefault(require("../utils/error"));
dotenv_1.default.config();
var verifyToken = function (req, res, next) {
    var authHeader = req.headers["authorization"];
    if (!authHeader) {
        return next((0, error_1.default)(401, "No token provided. Please login! 😞"));
    }
    var token = authHeader.split(" ")[1];
    if (!token) {
        return next((0, error_1.default)(401, "Invalid token format. Please login! 🤔"));
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            return next((0, error_1.default)(401, "Failed to authenticate token. Please login! 🤔"));
        }
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    });
};
exports.verifyToken = verifyToken;
var verifyIsUserAdmin = function (req, res, next) {
    if (req.user.role !== "admin") {
        return next((0, error_1.default)(401, "You are not allowed to do this. 👺"));
    }
    next();
};
exports.verifyIsUserAdmin = verifyIsUserAdmin;
