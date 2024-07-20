import { Request, Response, NextFunction } from "express";
import AppError from "./appError";

export const checkID = (
  req: Request,
  res: Response,
  next: NextFunction,
  val: string
) => {
  const id = req.params.id.trim();
  if (!id.length) {
    next(new AppError("Chat room ID missing!", 403));
  }
  next();
};
