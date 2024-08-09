import { Router } from "express";
// controllers
import {
  getBooks,
  getBookById,
  searchBooks,
} from "../controllers/book-controllers";

const router = Router();

// routes
router.get("/", getBooks);
router.get("/search", searchBooks);
router.get("/:bookId", getBookById);

export default router;
