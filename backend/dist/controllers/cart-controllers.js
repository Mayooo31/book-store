"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.removeAllItemsFromCart = exports.removeItemFromCart = exports.totalItemsInCart = exports.viewCart = exports.addItemToCart = void 0;
const db_1 = __importDefault(require("../src/db"));
// queries
const cart_queries_1 = require("../queries/cart-queries");
// utils
const error_1 = __importDefault(require("../utils/error"));
const addItemToCart = (req, res, next) => {
    const userId = req.user.userId;
    const { bookId, quantity } = req.body;
    const operation = req.body.operation;
    db_1.default.query(cart_queries_1.addOrSetItemToCartQuery[operation], [userId, bookId, quantity], (error, results) => {
        if (error) {
            return next((0, error_1.default)(500, "Item was not found. 😧"));
        }
        res.status(201).json(results.rows[0]);
    });
};
exports.addItemToCart = addItemToCart;
const viewCart = (req, res, next) => {
    const userId = req.user.userId;
    db_1.default.query(cart_queries_1.viewCartQuery, [userId], (error, results) => {
        var _a;
        if (error) {
            return next((0, error_1.default)(500, "Error fetching cart items"));
        }
        const cart = ((_a = results.rows[0]) === null || _a === void 0 ? void 0 : _a.cart) || { items: [], total_price: 0 };
        res.status(200).json(cart);
    });
};
exports.viewCart = viewCart;
const totalItemsInCart = (req, res, next) => {
    const userId = req.user.userId;
    db_1.default.query(cart_queries_1.totalItemsInCartQuery, [userId], (error, results) => {
        if (error) {
            return next((0, error_1.default)(500, "Error fetching cart items"));
        }
        res.status(200).json(results.rows[0]);
    });
};
exports.totalItemsInCart = totalItemsInCart;
const removeItemFromCart = (req, res, next) => {
    const userId = req.user.userId;
    const { itemId } = req.params;
    db_1.default.query(cart_queries_1.removeItemFromCartQuery, [userId, itemId], (error, results) => {
        if (error) {
            return next((0, error_1.default)(500, "Error removing from cart"));
        }
        if (results.rows.length === 0) {
            return next((0, error_1.default)(404, "Item not found in cart"));
        }
        res.status(200).json({ message: "Item removed from cart" });
    });
};
exports.removeItemFromCart = removeItemFromCart;
const removeAllItemsFromCart = (req, res, next) => {
    const userId = req.user.userId;
    db_1.default.query(cart_queries_1.removeAllItemsFromCartQuery, [userId], (error, results) => {
        if (error || results.rows.length === 0) {
            return next((0, error_1.default)(500, "Error removing from cart"));
        }
        res.status(200).json({ message: "All items were removed from cart." });
    });
};
exports.removeAllItemsFromCart = removeAllItemsFromCart;
const createOrder = (req, res, next) => {
    const userId = req.user.userId;
    const { shippingAddress, paymentMethod } = req.body;
    db_1.default.query(cart_queries_1.createOrderQuery, [userId, shippingAddress, paymentMethod], (error, result) => {
        if (error) {
            return next((0, error_1.default)(500, error));
        }
        const orderId = result.rows[0].p_order_id;
        res
            .status(201)
            .json({
            message: "Successfully ordered. We are already working on your order...",
            orderId,
        });
    });
};
exports.createOrder = createOrder;
