import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";

export function validateData(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      next(error);
    }
  };
}