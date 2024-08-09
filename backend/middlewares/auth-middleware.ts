import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// utils
import createError from "../utils/error";

dotenv.config();

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(createError(401, "No token provided. Please login! 😞"));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(createError(401, "Invalid token format. Please login! 🤔"));
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return next(
        createError(401, "Failed to authenticate token. Please login! 🤔")
      );
    }

    req.user = {
      userId: (decoded as { userId: number }).userId,
      role: (decoded as { role: "user" | "admin" }).role,
    };
    next();
  });
};

export const verifyIsUserAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role !== "admin") {
    return next(createError(401, "You are not allowed to do this. 👺"));
  }
  next();
};
