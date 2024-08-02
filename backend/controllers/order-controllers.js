"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderHistoryById = exports.getOrderHistory = void 0;
var db_1 = __importDefault(require("../src/db"));
// queries
var order_queries_1 = require("../queries/order-queries");
// utils
var error_1 = __importDefault(require("../utils/error"));
var getOrderHistory = function (req, res, next) {
    var userId = req.user.userId;
    db_1.default.query(order_queries_1.getOrderHistoryQuery, [userId], function (error, results) {
        if (error) {
            return next((0, error_1.default)(500, "Could not fetch order history. 😠"));
        }
        res.status(200).json(results.rows);
    });
};
exports.getOrderHistory = getOrderHistory;
var getOrderHistoryById = function (req, res, next) {
    var orderId = req.params.orderId;
    db_1.default.query(order_queries_1.getOrderHistoryByIdQuery, [+orderId], function (error, results) {
        if (error) {
            return next((0, error_1.default)(500, "Something happend. Try again later... 🥴"));
        }
        if (!results.rows[0]) {
            return next((0, error_1.default)(500, "Order with this ID does not exist... 🥴"));
        }
        res.status(200).json(results.rows[0].order_details);
    });
};
exports.getOrderHistoryById = getOrderHistoryById;
