"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenres = exports.getStatistics = exports.deleteBook = exports.updateBook = exports.addBook = exports.updateOrderStatus = exports.getAllOrders = void 0;
var db_1 = __importDefault(require("../src/db"));
// queries
var admin_queries_1 = require("../queries/admin-queries");
// utils
var error_1 = __importDefault(require("../utils/error"));
// constants
var constants_1 = require("../constants");
var getAllOrders = function (req, res, next) {
    var _a = req.query, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? "20" : _c;
    var offset = (+page - 1) * +limit;
    db_1.default.query(admin_queries_1.getAllOrdersQuery, [+limit, offset], function (error, results) {
        if (error) {
            return next((0, error_1.default)(500, "Error fetching orders"));
        }
        db_1.default.query("SELECT COUNT(*) FROM orders", function (countError, countResult) {
            if (countError) {
                return next((0, error_1.default)(500, "Error fetching orders count"));
            }
            var totalOrders = +countResult.rows[0].count;
            var totalPages = Math.ceil(totalOrders / +limit);
            res.status(200).json({
                results: results.rows,
                totalOrders: totalOrders,
                totalPages: totalPages,
                currentPage: page,
            });
        });
    });
};
exports.getAllOrders = getAllOrders;
var updateOrderStatus = function (req, res, next) {
    var orderId = req.params.orderId;
    var status = req.body.status;
    if (!constants_1.validStatuses.includes(status)) {
        return next((0, error_1.default)(400, "Invalid order status"));
    }
    db_1.default.query(admin_queries_1.updateOrderStatusQuery, [status, +orderId], function (error, results) {
        if (error) {
            return next((0, error_1.default)(500, error.message));
        }
        if (results.rowCount === 0) {
            return next((0, error_1.default)(404, "Order not found"));
        }
        res.status(200).json({ message: "Status was successfully updated. 😼" });
    });
};
exports.updateOrderStatus = updateOrderStatus;
var addBook = function (req, res, next) {
    var _a = req.body, title = _a.title, author = _a.author, description = _a.description, price = _a.price, yearPublished = _a.yearPublished, coverImage = _a.coverImage, pages = _a.pages, rating = _a.rating, isAvailable = _a.isAvailable, genres = _a.genres;
    db_1.default.query(admin_queries_1.addBookQuery, [
        title,
        author,
        description,
        price,
        yearPublished,
        coverImage,
        pages,
        rating,
        isAvailable,
    ], function (error, results) {
        if (error) {
            return next((0, error_1.default)(500, "Something happend and we could not add this book. Try again later... 🥶"));
        }
        var createdBookID = results.rows[0].id;
        db_1.default.query(admin_queries_1.addGenresToBookQuery, [createdBookID, genres], function (error, results_) {
            if (error) {
                return next((0, error_1.default)(500, "Error adding book genres"));
            }
            res.status(201).json({ id: results.rows[0].id });
        });
    });
};
exports.addBook = addBook;
var updateBook = function (req, res, next) {
    var bookId = req.params.bookId;
    var _a = req.body, title = _a.title, author = _a.author, description = _a.description, price = _a.price, yearPublished = _a.yearPublished, coverImage = _a.coverImage, pages = _a.pages, rating = _a.rating, isAvailable = _a.isAvailable, genres = _a.genres;
    db_1.default.query(admin_queries_1.updateBookQuery, [
        +bookId,
        title,
        author,
        description,
        price,
        yearPublished,
        coverImage,
        pages,
        rating,
        isAvailable,
    ], function (error, results) {
        if (results.rows.length === 0) {
            return next((0, error_1.default)(404, "Book not found"));
        }
        db_1.default.query(admin_queries_1.updateGenresToBookQuery, [+bookId, genres], function (error, results) {
            if (error) {
                console.log(error);
                return next((0, error_1.default)(500, "Error updating book"));
            }
            res
                .status(200)
                .json({ message: "Book was successfully updated! 😌" });
        });
    });
};
exports.updateBook = updateBook;
var deleteBook = function (req, res, next) {
    var bookId = req.params.bookId;
    db_1.default.query(admin_queries_1.deleteBookByIdQuery, [+bookId], function (error, results) {
        if (error) {
            console.log(error);
            return next((0, error_1.default)(500, "Error deleting book"));
        }
        if (results.rowCount === 0) {
            return next((0, error_1.default)(404, "Book not found"));
        }
        res.status(200).json({ message: "Book was deleted successfully... 😚" });
    });
};
exports.deleteBook = deleteBook;
var getStatistics = function (req, res, next) {
    db_1.default.query(admin_queries_1.getStatisticsQuery, function (error, results) {
        if (error) {
            return next((0, error_1.default)(500, "Error fetching statistics"));
        }
        res.status(200).json(results.rows[0]);
    });
};
exports.getStatistics = getStatistics;
var getGenres = function (req, res, next) {
    db_1.default.query(admin_queries_1.getGenresQuery, function (error, results) {
        if (error) {
            return next((0, error_1.default)(500, "We could fetch genres. Try again later."));
        }
        res.status(200).json(results.rows);
    });
};
exports.getGenres = getGenres;
