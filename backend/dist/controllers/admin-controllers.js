"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenres = exports.getStatistics = exports.deleteBook = exports.updateBook = exports.addBook = exports.updateOrderStatus = exports.getAllOrders = void 0;
const db_1 = __importDefault(require("../src/db"));
// queries
const admin_queries_1 = require("../queries/admin-queries");
// utils
const error_1 = __importDefault(require("../utils/error"));
// constants
const constants_1 = require("../constants");
const getAllOrders = (req, res, next) => {
    const { page = "1", limit = "20" } = req.query;
    const offset = (+page - 1) * +limit;
    db_1.default.query(admin_queries_1.getAllOrdersQuery, [+limit, offset], (error, results) => {
        if (error) {
            return next((0, error_1.default)(500, "Error fetching orders"));
        }
        db_1.default.query("SELECT COUNT(*) FROM orders", (countError, countResult) => {
            if (countError) {
                return next((0, error_1.default)(500, "Error fetching orders count"));
            }
            const totalOrders = +countResult.rows[0].count;
            const totalPages = Math.ceil(totalOrders / +limit);
            res.status(200).json({
                results: results.rows,
                totalOrders,
                totalPages,
                currentPage: page,
            });
        });
    });
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!constants_1.validStatuses.includes(status)) {
        return next((0, error_1.default)(400, "Invalid order status"));
    }
    db_1.default.query(admin_queries_1.updateOrderStatusQuery, [status, +orderId], (error, results) => {
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
const addBook = (req, res, next) => {
    const { title, author, description, price, yearPublished, coverImage, pages, rating, isAvailable, genres, } = req.body;
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
    ], (error, results) => {
        if (error) {
            return next((0, error_1.default)(500, "Something happend and we could not add this book. Try again later... 🥶"));
        }
        const createdBookID = results.rows[0].id;
        db_1.default.query(admin_queries_1.addGenresToBookQuery, [createdBookID, genres], (error, results_) => {
            if (error) {
                return next((0, error_1.default)(500, "Error adding book genres"));
            }
            res.status(201).json({ id: results.rows[0].id });
        });
    });
};
exports.addBook = addBook;
const updateBook = (req, res, next) => {
    const { bookId } = req.params;
    const { title, author, description, price, yearPublished, coverImage, pages, rating, isAvailable, genres, } = req.body;
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
    ], (error, results) => {
        if (results.rows.length === 0) {
            return next((0, error_1.default)(404, "Book not found"));
        }
        db_1.default.query(admin_queries_1.updateGenresToBookQuery, [+bookId, genres], (error, results) => {
            if (error) {
                return next((0, error_1.default)(500, "Error updating book"));
            }
            res
                .status(200)
                .json({ message: "Book was successfully updated! 😌" });
        });
    });
};
exports.updateBook = updateBook;
const deleteBook = (req, res, next) => {
    const { bookId } = req.params;
    db_1.default.query(admin_queries_1.deleteBookByIdQuery, [+bookId], (error, results) => {
        if (error) {
            return next((0, error_1.default)(500, "Error deleting book"));
        }
        if (results.rowCount === 0) {
            return next((0, error_1.default)(404, "Book not found"));
        }
        res.status(200).json({ message: "Book was deleted successfully... 😚" });
    });
};
exports.deleteBook = deleteBook;
const getStatistics = (req, res, next) => {
    db_1.default.query(admin_queries_1.getStatisticsQuery, (error, results) => {
        if (error) {
            return next((0, error_1.default)(500, "Error fetching statistics"));
        }
        res.status(200).json(results.rows[0]);
    });
};
exports.getStatistics = getStatistics;
const getGenres = (req, res, next) => {
    db_1.default.query(admin_queries_1.getGenresQuery, (error, results) => {
        if (error) {
            return next((0, error_1.default)(500, "We could fetch genres. Try again later."));
        }
        res.status(200).json(results.rows);
    });
};
exports.getGenres = getGenres;
