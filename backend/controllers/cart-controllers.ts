import { Request, Response, NextFunction } from "express";
import pool from "../src/db";
// queries
import {
  createOrderQuery,
  removeItemFromCartQuery,
  viewCartQuery,
  totalItemsInCartQuery,
  addOrSetItemToCartQuery,
  removeAllItemsFromCartQuery,
} from "../queries/cart-queries";
// utils
import createError from "../utils/error";

export const addItemToCart = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user.userId;
  const { bookId, quantity } = req.body;
  const operation: "add" | "set" = req.body.operation;

  pool.query(
    addOrSetItemToCartQuery[operation],
    [userId, bookId, quantity],
    (error, results) => {
      if (error) {
        return next(createError(500, "Item was not found. 😧"));
      }
      res.status(201).json(results.rows[0]);
    }
  );
};

export const viewCart = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user.userId;

  pool.query(viewCartQuery, [userId], (error, results) => {
    if (error) {
      return next(createError(500, "Error fetching cart items"));
    }

    const cart = results.rows[0]?.cart || { items: [], total_price: 0 };
    res.status(200).json(cart);
  });
};

export const totalItemsInCart = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user.userId;

  pool.query(totalItemsInCartQuery, [userId], (error, results) => {
    if (error) {
      return next(createError(500, "Error fetching cart items"));
    }
    res.status(200).json(results.rows[0]);
  });
};

export const removeItemFromCart = (
  req: Request<{ itemId: string }>,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user.userId;
  const { itemId } = req.params;

  pool.query(removeItemFromCartQuery, [userId, itemId], (error, results) => {
    if (error) {
      return next(createError(500, "Error removing from cart"));
    }
    if (results.rows.length === 0) {
      return next(createError(404, "Item not found in cart"));
    }
    res.status(200).json({ message: "Item removed from cart" });
  });
};

export const removeAllItemsFromCart = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user.userId;

  pool.query(removeAllItemsFromCartQuery, [userId], (error, results) => {
    if (error || results.rows.length === 0) {
      return next(createError(500, "Error removing from cart"));
    }
    res.status(200).json({ message: "All items were removed from cart." });
  });
};

export const createOrder = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user.userId;
  const { shippingAddress, paymentMethod } = req.body;

  pool.query(
    createOrderQuery,
    [userId, shippingAddress, paymentMethod],
    (error: any, result) => {
      if (error) {
        return next(createError(500, error));
      }

      const orderId = result.rows[0].p_order_id;

      res
        .status(201)
        .json({
          message:
            "Successfully ordered. We are already working on your order...",
          orderId,
        });
    }
  );
};
