"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBooks = exports.getBookById = exports.getBooks = void 0;
var db_1 = __importDefault(require("../src/db"));
// queries
var book_queries_1 = require("../queries/book-queries");
// utils
var error_1 = __importDefault(require("../utils/error"));
var getBooks = function (req, res, next) {
    var _a = req.query, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? "20" : _c;
    var offset = (+page - 1) * +limit;
    db_1.default.query(book_queries_1.getBooksQuery, [+limit, offset], function (error, results) {
        if (error) {
            return next((0, error_1.default)(500, "Something went wrong. Could not fetch these books... 🤕"));
        }
        db_1.default.query("SELECT COUNT(*) FROM book", function (countError, countResult) {
            if (countError) {
                return next((0, error_1.default)(500, "Error fetching orders count"));
            }
            var totalBooks = +countResult.rows[0].count;
            var totalPages = Math.ceil(totalBooks / +limit);
            res.status(200).json({
                results: results.rows,
                totalBooks: totalBooks,
                totalPages: totalPages,
                currentPage: page,
            });
        });
    });
};
exports.getBooks = getBooks;
var getBookById = function (req, res, next) {
    var bookId = req.params.bookId;
    console.log(bookId);
    db_1.default.query(book_queries_1.getBookByIdQuery, [+bookId], function (error, results) {
        if (error) {
            return next((0, error_1.default)(500, "Error fetching book details"));
        }
        if (results.rows.length === 0) {
            return next((0, error_1.default)(404, "Book not found"));
        }
        res.status(200).json(results.rows[0]);
    });
};
exports.getBookById = getBookById;
var searchBooks = function (req, res, next) {
    var _a = req.query, q = _a.q, _b = _a.page, page = _b === void 0 ? "1" : _b, _c = _a.limit, limit = _c === void 0 ? "20" : _c;
    db_1.default.query(book_queries_1.searchByQueryParamsQuery, ["%".concat(q, "%"), limit], function (error, results) {
        if (error) {
            return next((0, error_1.default)(500, "Error searching books"));
        }
        db_1.default.query("SELECT COUNT(*) FROM book WHERE title ILIKE $1 OR author ILIKE $1", ["%".concat(q, "%")], function (countError, countResult) {
            if (countError) {
                return next((0, error_1.default)(500, "Error fetching search count"));
            }
            var totalBooks = +countResult.rows[0].count;
            var totalPages = Math.ceil(totalBooks / +limit);
            res.status(200).json({
                results: results.rows,
                totalBooks: totalBooks,
                totalPages: totalPages,
                currentPage: page,
            });
        });
    });
};
exports.searchBooks = searchBooks;
