"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBooks = exports.getBookById = exports.getBooks = void 0;
const db_1 = __importDefault(require("../src/db"));
// queries
const book_queries_1 = require("../queries/book-queries");
// utils
const error_1 = __importDefault(require("../utils/error"));
const getBooks = (req, res, next) => {
    const { page = "1", limit = "20" } = req.query;
    const offset = (+page - 1) * +limit;
    db_1.default.query(book_queries_1.getBooksQuery, [+limit, offset], (error, results) => {
        if (error) {
            console.log(error);
            return next((0, error_1.default)(500, "Something went wrong. Could not fetch these books... 🤕"));
        }
        db_1.default.query("SELECT COUNT(*) FROM book", (countError, countResult) => {
            if (countError) {
                return next((0, error_1.default)(500, "Error fetching orders count"));
            }
            const totalBooks = +countResult.rows[0].count;
            const totalPages = Math.ceil(totalBooks / +limit);
            res.status(200).json({
                results: results.rows,
                totalBooks,
                totalPages,
                currentPage: page,
            });
        });
    });
};
exports.getBooks = getBooks;
const getBookById = (req, res, next) => {
    const { bookId } = req.params;
    db_1.default.query(book_queries_1.getBookByIdQuery, [+bookId], (error, results) => {
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
const searchBooks = (req, res, next) => {
    const { q, page = "1", limit = "20" } = req.query;
    db_1.default.query(book_queries_1.searchByQueryParamsQuery, [`%${q}%`, limit], (error, results) => {
        if (error) {
            console.log(error);
            return next((0, error_1.default)(500, "Error searching books"));
        }
        db_1.default.query("SELECT COUNT(*) FROM book WHERE title ILIKE $1 OR author ILIKE $1", [`%${q}%`], (countError, countResult) => {
            if (countError) {
                return next((0, error_1.default)(500, "Error fetching search count"));
            }
            const totalBooks = +countResult.rows[0].count;
            const totalPages = Math.ceil(totalBooks / +limit);
            res.status(200).json({
                results: results.rows,
                totalBooks,
                totalPages,
                currentPage: page,
            });
        });
    });
};
exports.searchBooks = searchBooks;
