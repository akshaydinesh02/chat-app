import { Response, Request, NextFunction } from "express";
import { addNewRoom, getRoomsLength } from "../utils/rooms.util";

export const checkRoomsLength = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const size = getRoomsLength();
  if (size >= 2) {
    return res.json({
      status: "fail",
      error: 429,
      message: "Number of rooms full, try again later!",
    });
  } else {
    return next();
  }
};

export const createNewRoom = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals.newRoomData) {
    return res.status(500);
  }
  const newRoomData = res.locals.newRoomData;
  addNewRoom(newRoomData);
  res.locals.newRoomId = newRoomData.id;
  next();
};
