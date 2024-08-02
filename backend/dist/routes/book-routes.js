"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controllers
const book_controllers_1 = require("../controllers/book-controllers");
const router = (0, express_1.Router)();
// routes
router.get("/", book_controllers_1.getBooks);
router.get("/search", book_controllers_1.searchBooks);
router.get("/:bookId", book_controllers_1.getBookById);
exports.default = router;
