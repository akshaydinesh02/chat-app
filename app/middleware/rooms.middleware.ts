import { Response, Request, NextFunction } from "express";
import { addNewRoom, getRoomsLength } from "../utils/rooms.util";
import {
  checkIfRoomExist,
  roomWebSocketServers,
} from "../helpers/rooms.helper";
import { WebSocketServer } from "ws";
import WebSocket from "ws";

// Function to broadcast messages to all clients in a room
function broadcast(wss: WebSocketServer, msg: WebSocket.Data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

export const checkRoomsLength = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const size = getRoomsLength();
  if (size >= 10) {
    return res.status(429).send("Number of rooms full, try again later!");
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
    res.status(500).send("Something broke!");
    return;
  }
  const newRoomData = res.locals.newRoomData;
  addNewRoom(newRoomData);
  const newRoomId = newRoomData.id;
  res.locals.newRoomId = newRoomId;

  const roomServer = new WebSocketServer({ noServer: true });
  roomWebSocketServers[newRoomId] = roomServer;

  roomServer.on("connection", (client: WebSocket) => {
    console.log(`Client connected to room ${newRoomId}`);

    client.on("message", (msg: WebSocket.Data) => {
      console.log(`Message in room ${newRoomId}: ${msg}`);
      broadcast(roomServer, msg);
    });

    client.on("close", () => {
      console.log(`Client disconnected from room ${newRoomId}`);
    });
  });

  next();
};

export const validateRoomDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const roomId = req.params.roomId;
  const roomExists = checkIfRoomExist(roomId);
  if (!roomExists) {
    res.status(404).send("Room not found");
    return;
  }
  next();
};
