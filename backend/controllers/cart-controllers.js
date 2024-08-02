"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.removeAllItemsFromCart = exports.removeItemFromCart = exports.totalItemsInCart = exports.viewCart = exports.addItemToCart = void 0;
var db_1 = __importDefault(require("../src/db"));
// queries
var cart_queries_1 = require("../queries/cart-queries");
// utils
var error_1 = __importDefault(require("../utils/error"));
var addItemToCart = function (req, res, next) {
    var userId = req.user.userId;
    var _a = req.body, bookId = _a.bookId, quantity = _a.quantity;
    var operation = req.body.operation;
    db_1.default.query(cart_queries_1.addOrSetItemToCartQuery[operation], [userId, bookId, quantity], function (error, results) {
        if (error) {
            console.log(error);
            return next((0, error_1.default)(500, "Item was not found. 😧"));
        }
        res.status(201).json(results.rows[0]);
    });
};
exports.addItemToCart = addItemToCart;
var viewCart = function (req, res, next) {
    var userId = req.user.userId;
    db_1.default.query(cart_queries_1.viewCartQuery, [userId], function (error, results) {
        var _a;
        if (error) {
            return next((0, error_1.default)(500, "Error fetching cart items"));
        }
        var cart = ((_a = results.rows[0]) === null || _a === void 0 ? void 0 : _a.cart) || { items: [], total_price: 0 };
        res.status(200).json(cart);
    });
};
exports.viewCart = viewCart;
var totalItemsInCart = function (req, res, next) {
    var userId = req.user.userId;
    db_1.default.query(cart_queries_1.totalItemsInCartQuery, [userId], function (error, results) {
        if (error) {
            return next((0, error_1.default)(500, "Error fetching cart items"));
        }
        res.status(200).json(results.rows[0]);
    });
};
exports.totalItemsInCart = totalItemsInCart;
var removeItemFromCart = function (req, res, next) {
    var userId = req.user.userId;
    var itemId = req.params.itemId;
    db_1.default.query(cart_queries_1.removeItemFromCartQuery, [userId, itemId], function (error, results) {
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
var removeAllItemsFromCart = function (req, res, next) {
    var userId = req.user.userId;
    db_1.default.query(cart_queries_1.removeAllItemsFromCartQuery, [userId], function (error, results) {
        if (error || results.rows.length === 0) {
            return next((0, error_1.default)(500, "Error removing from cart"));
        }
        res.status(200).json({ message: "All items were removed from cart." });
    });
};
exports.removeAllItemsFromCart = removeAllItemsFromCart;
var createOrder = function (req, res, next) {
    var userId = req.user.userId;
    var _a = req.body, shippingAddress = _a.shippingAddress, paymentMethod = _a.paymentMethod;
    db_1.default.query(cart_queries_1.createOrderQuery, [userId, shippingAddress, paymentMethod], function (error, result) {
        if (error) {
            return next((0, error_1.default)(500, error));
        }
        var orderId = result.rows[0].p_order_id;
        res.status(201).json({ message: "Order placed successfully", orderId: orderId });
    });
};
exports.createOrder = createOrder;
