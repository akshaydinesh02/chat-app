import { Response, Request, NextFunction } from "express";
import { roomsMetaDataNew } from "../helpers/rooms.helper";
import { generateUniqueId, getCurrentDate } from "../utils/rooms.util";

const checkID = (
  req: Request,
  res: Response,
  next: NextFunction,
  val: string
) => {
  const id = req.params.id.trim();
  if (!id.length) {
    return res.status(403).json({
      status: "fail",
      message: "Room ID missing! Please input the Room ID!",
    });
  }
  next();
};

const validateRoom = (
  req: Request,
  res: Response,
  next: NextFunction,
  val: string
) => {
  const { id } = req.params;
  const roomExists = roomsMetaDataNew.has(id);
  if (!roomExists) {
    return res.status(404).json({
      status: "fail",
      message: "Chat room not found!",
    });
  }
  next();
};

const getRoomsCount = (req: Request, res: Response) => {
  const roomsCount = roomsMetaDataNew.size;
  res.status(200).json({
    status: "success",
    length: roomsCount,
  });
};

const getRoom = (req: Request, res: Response) => {
  const { id } = req.params;
  const room = roomsMetaDataNew.get(id);
  res.status(200).json({
    status: "success",
    data: {
      room,
    },
  });
};

const createRoom = (req: Request, res: Response) => {
  const newId = generateUniqueId();
  const { name } = req.body;
  const date = new Date().toISOString();
  const newRoom = {
    id: newId,
    createdAt: date,
    users: new Map([["12345", { name: "Akshay", id: "12345" }]]),
  };
  roomsMetaDataNew.set(newId, newRoom);
  res.status(201).json({
    status: "success",
    data: {
      room: newRoom,
    },
  });
};

const updateRoom = (req: Request, res: Response) => {
  const { id } = req.params;
  const { newUser } = req.body;
  const room = roomsMetaDataNew.get(id);

  if (room) {
    room.users.set(newUser.id, newUser);

    roomsMetaDataNew.set(id, room);
  }

  res.status(200).json({
    status: "success",
    data: {
      room,
    },
  });
};

const deleteRoom = (req: Request, res: Response) => {
  const { id } = req.params;

  roomsMetaDataNew.delete(id);
  res.status(204).json({
    status: "success",
    data: null,
  });
};

export {
  getRoomsCount,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  checkID,
  validateRoom,
};
