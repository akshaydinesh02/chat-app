import { Request, Response, NextFunction } from "express";
import {
  broadcast,
  decryptNumber,
  roomsMetaDataNew,
  roomWebSocketServers,
} from "../helpers/rooms.helper";
import { generateUniqueId, getCurrentDate } from "../utils/rooms.util";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import { users } from "../helpers/users.helper";

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
      users: new Map([[id, { name, id, email }]]),
      allowedUsers: new Map([
        [invitee, "invitee"],
        [user.email, "inviter"],
      ]),
    };
    roomsMetaDataNew.set(newId, newRoom);

    const roomServer = new WebSocketServer({ noServer: true });
    roomWebSocketServers[newId] = roomServer;

    roomServer.on("connection", (client: WebSocket) => {
      console.log(`Client connected to room ${newId}`);

      client.on("message", (msg: WebSocket.Data) => {
        console.log(`Message in room ${newId}: ${msg}`);
        broadcast(roomServer, msg);
      });

      client.on("close", () => {
        console.log(`Client disconnected from room ${newId}`);
      });
    });

    console.log("Rooms metadata", roomsMetaDataNew);

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
      room.users.set(user.id, { id: user.id, name: user.user_metadata.name });

      roomsMetaDataNew.set(id, room);
    }

    console.log("New room data", roomsMetaDataNew);

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

    roomsMetaDataNew.delete(id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export { getRoomsCount, getRoom, createRoom, updateRoom, deleteRoom };
