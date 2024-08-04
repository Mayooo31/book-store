import { Request, Response, NextFunction } from "express";
import pool from "../src/db";
// queries
import {
  getBookByIdQuery,
  getBooksQuery,
  searchByQueryParamsQuery,
} from "../queries/book-queries";
// utils
import createError from "../utils/error";
// types
import type { PaginationQuery } from "../types/types";

export const getBooks = (
  req: Request<{}, {}, {}, PaginationQuery>,
  res: Response,
  next: NextFunction
): void => {
  const { page = "1", limit = "20" } = req.query;
  const offset = (+page - 1) * +limit;

  pool.query(getBooksQuery, [+limit, offset], (error, results) => {
    if (error) {
      return next(
        createError(
          500,
          "Something went wrong. Could not fetch these books... 🤕"
        )
      );
    }

    pool.query("SELECT COUNT(*) FROM book", (countError, countResult) => {
      if (countError) {
        return next(createError(500, "Error fetching orders count"));
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

export const getBookById = (
  req: Request<{ bookId: number }>,
  res: Response,
  next: NextFunction
): void => {
  const { bookId } = req.params;
  pool.query(getBookByIdQuery, [+bookId], (error, results) => {
    if (error) {
      return next(createError(500, "Error fetching book details"));
    }
    if (results.rows.length === 0) {
      return next(createError(404, "Book not found"));
    }
    res.status(200).json(results.rows[0]);
  });
};

export const searchBooks = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { q, page = "1", limit = "20" } = req.query;

  pool.query(searchByQueryParamsQuery, [`%${q}%`, limit], (error, results) => {
    if (error) {
      return next(createError(500, "Error searching books"));
    }

    pool.query(
      "SELECT COUNT(*) FROM book WHERE title ILIKE $1 OR author ILIKE $1",
      [`%${q}%`],
      (countError, countResult) => {
        if (countError) {
          return next(createError(500, "Error fetching search count"));
        }

        const totalBooks = +countResult.rows[0].count;
        const totalPages = Math.ceil(totalBooks / +limit);

        res.status(200).json({
          results: results.rows,
          totalBooks,
          totalPages,
          currentPage: page,
        });
      }
    );
  });
};
