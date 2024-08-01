import { Request, Response, NextFunction } from "express";
import pool from "../src/db";
// queries
import {
  getOrderHistoryByIdQuery,
  getOrderHistoryQuery,
} from "../queries/order-queries";
// utils
import createError from "../utils/error";

export const getOrderHistory = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user.userId;

  pool.query(getOrderHistoryQuery, [userId], (error, results) => {
    if (error) {
      return next(createError(500, "Could not fetch order history. 😠"));
    }
    res.status(200).json(results.rows);
  });
};

export const getOrderHistoryById = (
  req: Request<{ orderId: string }>,
  res: Response,
  next: NextFunction
): void => {
  const { orderId } = req.params;

  pool.query(getOrderHistoryByIdQuery, [+orderId], (error, results) => {
    if (error) {
      return next(createError(500, "Something happend. Try again later... 🥴"));
    }
    if (!results.rows[0]) {
      return next(createError(500, "Order with this ID does not exist... 🥴"));
    }
    res.status(200).json(results.rows[0].order_details);
  });
};
