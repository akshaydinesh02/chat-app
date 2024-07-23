import { Request, Response, NextFunction } from "express";
import AppError from "./appError";
import { supabase } from "../server";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("Unauthorized! No token provided", 401));
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error) {
    return next(new AppError("Invalid token", 401));
  }

  res.locals.user = user;
  next();
};
