import { Request, Response, NextFunction } from "express";
import { roomsMetaDataNew } from "../helpers/rooms.helper";
import { generateUniqueId, getCurrentDate } from "../utils/rooms.util";
import { catchAsync } from "../utils/catchAsync";

const getRoomsCount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const roomsCount = roomsMetaDataNew.size;
    res.status(200).json({
      status: "success",
      length: roomsCount,
    });
  }
);

const getRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const room = roomsMetaDataNew.get(id);
    res.status(200).json({
      status: "success",
      data: {
        room,
      },
    });
  }
);

const createRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newId = generateUniqueId();
    const date = new Date().toISOString();
    const user = res.locals.user;
    const {
      id,
      user_metadata: { email, name },
    } = user;
    const newRoom = {
      id: newId,
      createdAt: date,
      users: new Map([[id, { name, id, email }]]),
    };
    roomsMetaDataNew.set(newId, newRoom);
    res.status(201).json({
      status: "success",
      data: {
        room: {
          id: newRoom.id,
          createdAt: newRoom.createdAt,
        },
      },
    });
  }
);

const updateRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

const deleteRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    roomsMetaDataNew.delete(id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export { getRoomsCount, getRoom, createRoom, updateRoom, deleteRoom };
