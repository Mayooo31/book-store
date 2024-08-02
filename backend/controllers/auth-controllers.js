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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
var db_1 = __importDefault(require("../src/db"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
// Queries
var auth_queries_1 = require("../queries/auth-queries");
// utils
var error_1 = __importDefault(require("../utils/error"));
dotenv_1.default.config();
var register = function (req, res, next) {
    var _a = req.body, name = _a.name, email = _a.email, password = _a.password;
    db_1.default.query(auth_queries_1.checkEmailExistsQuery, [email], function (error, results) { return __awaiter(void 0, void 0, void 0, function () {
        var hashedPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (results.rows[0]) {
                        return [2 /*return*/, next((0, error_1.default)(500, "Email is already registered! Please login. 🤨"))];
                    }
                    return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                case 1:
                    hashedPassword = _a.sent();
                    db_1.default.query(auth_queries_1.registerQuery, [name, email, hashedPassword], function (error, results) {
                        if (error) {
                            return next((0, error_1.default)(500, "Could not register! Please try again later. 🤨"));
                        }
                        res.status(200).json({
                            message: "Successfully registered! Now you can login. 😋",
                        });
                    });
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.register = register;
var login = function (req, res, next) {
    var _a = req.body, email = _a.email, password = _a.password;
    db_1.default.query(auth_queries_1.loginQuery, [email], function (error, results) { return __awaiter(void 0, void 0, void 0, function () {
        var loggedUser, isPasswordCorrect, token, expirationDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loggedUser = results.rows[0];
                    if (!loggedUser) {
                        return [2 /*return*/, next((0, error_1.default)(404, "This email is not yet registered. Please register first. 😞"))];
                    }
                    return [4 /*yield*/, bcrypt_1.default.compare(password, loggedUser.password)];
                case 1:
                    isPasswordCorrect = _a.sent();
                    if (!isPasswordCorrect) {
                        return [2 /*return*/, next((0, error_1.default)(401, "Wrong password. Do you really forgot your own password? 🤓"))];
                    }
                    token = jsonwebtoken_1.default.sign({
                        userId: loggedUser.id,
                        name: loggedUser.name,
                        email: loggedUser.email,
                        role: loggedUser.role,
                    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
                    expirationDate = new Date();
                    expirationDate.setSeconds(expirationDate.getSeconds() + 365 * 24 * 60 * 60); // 365 days in seconds
                    res.status(200).json({
                        message: "You have been successfully logged in. 🥳",
                        name: loggedUser.name,
                        email: loggedUser.email,
                        token: token,
                        role: loggedUser.role,
                        expiresAt: expirationDate.toISOString(),
                    });
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.login = login;
