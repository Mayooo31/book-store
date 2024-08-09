import { Request, Response, NextFunction } from "express";
import pool from "../src/db";
// queries
import {
  getAllOrdersQuery,
  updateOrderStatusQuery,
  addBookQuery,
  addGenresToBookQuery,
  deleteBookByIdQuery,
  updateBookQuery,
  updateGenresToBookQuery,
  getStatisticsQuery,
  getGenresQuery,
} from "../queries/admin-queries";
// utils
import createError from "../utils/error";
// constants
import { validStatuses } from "../constants";
// types
import { Book } from "../types/types";

export const getAllOrders = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { page = "1", limit = "20" } = req.query;
  const offset = (+page - 1) * +limit;

  pool.query(getAllOrdersQuery, [+limit, offset], (error, results) => {
    if (error) {
      return next(createError(500, "Error fetching orders"));
    }

    pool.query("SELECT COUNT(*) FROM orders", (countError, countResult) => {
      if (countError) {
        return next(createError(500, "Error fetching orders count"));
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

export const updateOrderStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!validStatuses.includes(status)) {
    return next(createError(400, "Invalid order status"));
  }

  pool.query(updateOrderStatusQuery, [status, +orderId], (error, results) => {
    if (error) {
      return next(createError(500, error.message));
    }
    if (results.rowCount === 0) {
      return next(createError(404, "Order not found"));
    }
    res.status(200).json({ message: "Status was successfully updated. 😼" });
  });
};

export const addBook = (
  req: Request<{}, {}, Book>,
  res: Response,
  next: NextFunction
) => {
  const {
    title,
    author,
    description,
    price,
    yearPublished,
    coverImage,
    pages,
    rating,
    isAvailable,
    genres,
  } = req.body;

  pool.query(
    addBookQuery,
    [
      title,
      author,
      description,
      price,
      yearPublished,
      coverImage,
      pages,
      rating,
      isAvailable,
    ],
    (error, results) => {
      if (error) {
        return next(
          createError(
            500,
            "Something happend and we could not add this book. Try again later... 🥶"
          )
        );
      }

      const createdBookID = results.rows[0].id;
      pool.query(
        addGenresToBookQuery,
        [createdBookID, genres],
        (error, results_) => {
          if (error) {
            return next(createError(500, "Error adding book genres"));
          }
          res.status(201).json({ id: results.rows[0].id });
        }
      );
    }
  );
};

export const updateBook = (
  req: Request<{ bookId: string }, {}, Book>,
  res: Response,
  next: NextFunction
) => {
  const { bookId } = req.params;
  const {
    title,
    author,
    description,
    price,
    yearPublished,
    coverImage,
    pages,
    rating,
    isAvailable,
    genres,
  } = req.body;

  pool.query(
    updateBookQuery,
    [
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
    ],
    (error, results) => {
      if (results.rows.length === 0) {
        return next(createError(404, "Book not found"));
      }

      pool.query(
        updateGenresToBookQuery,
        [+bookId, genres],
        (error, results) => {
          if (error) {
            return next(createError(500, "Error updating book"));
          }
          res
            .status(200)
            .json({ message: "Book was successfully updated! 😌" });
        }
      );
    }
  );
};

export const deleteBook = (
  req: Request<{ bookId: string }>,
  res: Response,
  next: NextFunction
): void => {
  const { bookId } = req.params;
  pool.query(deleteBookByIdQuery, [+bookId], (error, results) => {
    if (error) {
      return next(createError(500, "Error deleting book"));
    }
    if (results.rowCount === 0) {
      return next(createError(404, "Book not found"));
    }
    res.status(200).json({ message: "Book was deleted successfully... 😚" });
  });
};

export const getStatistics = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  pool.query(getStatisticsQuery, (error, results) => {
    if (error) {
      return next(createError(500, "Error fetching statistics"));
    }

    res.status(200).json(results.rows[0]);
  });
};

export const getGenres = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  pool.query(getGenresQuery, (error, results) => {
    if (error) {
      return next(createError(500, "We could fetch genres. Try again later."));
    }

    res.status(200).json(results.rows);
  });
};
