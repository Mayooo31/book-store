"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../src/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Queries
const auth_queries_1 = require("../queries/auth-queries");
// utils
const error_1 = __importDefault(require("../utils/error"));
const convertToMilliseconds_1 = __importDefault(require("../utils/convertToMilliseconds"));
dotenv_1.default.config();
const register = (req, res, next) => {
    const { name, email, password } = req.body;
    db_1.default.query(auth_queries_1.checkEmailExistsQuery, [email], (error, results) => __awaiter(void 0, void 0, void 0, function* () {
        if (results.rows[0]) {
            return next((0, error_1.default)(500, "Email is already registered! Please login. 🤨"));
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        db_1.default.query(auth_queries_1.registerQuery, [name, email, hashedPassword], (error, results) => {
            if (error) {
                return next((0, error_1.default)(500, "Could not register! Please try again later. 🤨"));
            }
            res.status(200).json({
                message: "Successfully registered! Now you can login. 😋",
            });
        });
    }));
};
exports.register = register;
const login = (req, res, next) => {
    const { email, password } = req.body;
    db_1.default.query(auth_queries_1.loginQuery, [email], (error, results) => __awaiter(void 0, void 0, void 0, function* () {
        const loggedUser = results.rows[0];
        if (!loggedUser) {
            return next((0, error_1.default)(404, "This email is not yet registered. Please register first. 😞"));
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, loggedUser.password);
        if (!isPasswordCorrect) {
            return next((0, error_1.default)(401, "Wrong password. Do you really forgot your own password? 🤓"));
        }
        const token = jsonwebtoken_1.default.sign({
            userId: loggedUser.id,
            name: loggedUser.name,
            email: loggedUser.email,
            role: loggedUser.role,
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
        const expiresIn = (0, convertToMilliseconds_1.default)(process.env.JWT_EXPIRATION_TIME);
        const expirationTime = new Date(Date.now() + expiresIn).toISOString();
        res.status(200).json({
            message: "You have been successfully logged in. 🥳",
            name: loggedUser.name,
            email: loggedUser.email,
            token,
            role: loggedUser.role,
            expiresAt: expirationTime,
        });
    }));
};
exports.login = login;
