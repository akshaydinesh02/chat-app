import { Response, Request, NextFunction } from "express";
import { roomsMetaDataNew } from "../helpers/rooms.helper";

const ROOM_CREATION_LIMIT = 10;

const isRoomCreationLimitExhausted = (limit: number): boolean => {
  return roomsMetaDataNew.size >= limit;
};

export const checkRoomsLength = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isRoomCreationLimitExhausted(ROOM_CREATION_LIMIT)) {
    return res.status(429).send("Number of rooms full, try again later!");
  }
  next();
};
