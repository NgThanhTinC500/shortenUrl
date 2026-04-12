import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const errorHandlingMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ✅ Zod error (format đẹp)
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.fromEntries(
        error.issues.map((issue) => [
          issue.path.join("."),
          issue.message,
        ])
      ),
    });
  }

  // ✅ AppError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // ❌ lỗi khác
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};