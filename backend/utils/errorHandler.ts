import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const errorStatus: number = err.status || 500;
  const errorMessage: string =
    err.message || "Something went wrong. Please try again later! ";
  return res.status(errorStatus).json({
    success: false,
    message: errorMessage,
    status: errorStatus,
  });
};

export default errorHandler;
