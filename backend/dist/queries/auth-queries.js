"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginQuery = exports.registerQuery = exports.checkEmailExistsQuery = void 0;
exports.checkEmailExistsQuery = "SELECT email FROM users WHERE email = $1";
exports.registerQuery = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
exports.loginQuery = "SELECT * FROM users WHERE email = $1";
