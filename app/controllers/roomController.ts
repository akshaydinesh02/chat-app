import { Request, Response, NextFunction } from "express";
import {
  createRoomServer,
  roomMetaDataServer,
  roomsMetaDataNew,
} from "../helpers/rooms.helper";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import { generateRoomId } from "../utils/generateRoomId";

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
    const user = res.locals.user;

    if (!room?.allowedUsers.has(user.email)) {
      new AppError("Unauthorized! You do not have access to this room", 401);
    }

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
    const newId = generateRoomId();
    const date = new Date().toISOString();
    const user = res.locals.user;

    const { invitee } = req.body;
    if (!invitee) {
      return next(new AppError("Bad data! Invitee Email ID not found", 400));
    }

    const {
      id,
      user_metadata: { email, name },
    } = user;
    const newRoom = {
      id: newId,
      createdAt: date,
      onlineUsers: new Map([[id, { name, id, email }]]),
      allowedUsers: new Map([
        [invitee, "invitee"],
        [email, "inviter"],
      ]),
    };
    roomsMetaDataNew.set(newId, newRoom);

    createRoomServer(newId);

    roomMetaDataServer?.clients.forEach((client) => {
      client.send(roomsMetaDataNew.size.toString());
    });

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
    const user = res.locals.user;
    const room = roomsMetaDataNew.get(id);

    if (!room) {
      return next(new AppError("No chat room found with that ID", 404));
    }

    if (room) {
      if (!room.allowedUsers.has(user.email)) {
        return next(
          new AppError("Unauthorized! You do not have access to this room", 401)
        );
      }
      room.onlineUsers.set(user.id, {
        id: user.id,
        name: user.user_metadata.name,
        email: user.email,
      });

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
    const room = roomsMetaDataNew.get(id);
    const user = res.locals.user;

    roomMetaDataServer?.clients.forEach((client) => {
      client.send(roomsMetaDataNew.size.toString());
    });

    roomsMetaDataNew.delete(id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

// const getRoomMetaData = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     res.status(200).json({
//       status: "success",
//       length: roomsMetaDataNew.size,
//     });
//   }
// );

export {
  getRoomsCount,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  // getRoomMetaData,
};
