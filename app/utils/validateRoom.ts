import { Request, Response, NextFunction } from "express";
import { roomsMetaDataNew } from "../helpers/rooms.helper";
import AppError from "./appError";

export const validateRoom = (
  req: Request,
  res: Response,
  next: NextFunction,
  val: string
) => {
  const { id } = req.params;
  const roomExists = roomsMetaDataNew.has(id);
  if (!roomExists) {
    return next(new AppError("No chat room found with that ID", 404));
  }
  next();
};
