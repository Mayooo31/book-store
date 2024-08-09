import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import pool from "../src/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// Queries
import {
  checkEmailExistsQuery,
  loginQuery,
  registerQuery,
} from "../queries/auth-queries";
// utils
import createError from "../utils/error";
import convertToMilliseconds from "../utils/convertToMilliseconds";

dotenv.config();

export const register = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  pool.query(
    checkEmailExistsQuery,
    [email],
    async (error: Error, results: QueryResult) => {
      if (results.rows[0]) {
        return next(
          createError(500, "Email is already registered! Please login. 🤨")
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      pool.query(
        registerQuery,
        [name, email, hashedPassword],
        (error: Error, results: QueryResult) => {
          if (error) {
            return next(
              createError(500, "Could not register! Please try again later. 🤨")
            );
          }

          res.status(200).json({
            message: "Successfully registered! Now you can login. 😋",
          });
        }
      );
    }
  );
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  pool.query(loginQuery, [email], async (error, results) => {
    const loggedUser = results.rows[0];
    if (!loggedUser) {
      return next(
        createError(
          404,
          "This email is not yet registered. Please register first. 😞"
        )
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      loggedUser.password
    );
    if (!isPasswordCorrect) {
      return next(
        createError(
          401,
          "Wrong password. Do you really forgot your own password? 🤓"
        )
      );
    }

    const token = jwt.sign(
      {
        userId: loggedUser.id,
        name: loggedUser.name,
        email: loggedUser.email,
        role: loggedUser.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION_TIME! }
    );

    const expiresIn = convertToMilliseconds(process.env.JWT_EXPIRATION_TIME!);
    const expirationTime = new Date(Date.now() + expiresIn).toISOString();

    res.status(200).json({
      message: "You have been successfully logged in. 🥳",
      name: loggedUser.name,
      email: loggedUser.email,
      token,
      role: loggedUser.role,
      expiresAt: expirationTime,
    });
  });
};
