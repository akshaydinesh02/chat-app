import { createServer } from "http";
import { Response, Request, NextFunction } from "express";
import express from "express";
import cors from "cors";
import {
  checkRoomsLength,
  createNewRoom,
  validateRoomDetails,
} from "./middleware/rooms.middleware";
import { checkUserAuth } from "./middleware/auth.middleware";
import { validateUserData } from "./middleware/zod.middleware";
import {
  roomsMetaData,
  roomsMetaDataNew,
  roomWebSocketServers,
} from "./helpers/rooms.helper";
import { WebSocketServer } from "ws";
import { generateUniqueId, getCurrentDate } from "./utils/rooms.util";

const app = express();

app.use(cors());
app.use(express.json());

const server = createServer(app);

server.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url || "", `http://${request.headers.host}`)
    .pathname;
  const roomId = pathname.split("/")[2];

  if (roomWebSocketServers[roomId]) {
    roomWebSocketServers[roomId].handleUpgrade(request, socket, head, (ws) => {
      roomWebSocketServers[roomId].emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

// REFACTORING

const getRoomsCount = (req: Request, res: Response) => {
  const roomsCount = roomsMetaDataNew.size;
  res.status(200).json({
    status: "success",
    length: roomsCount,
  });
};

const checkIfRoomExists = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(403).json({
      status: "fail",
      message: "Room ID missing! Please input the Room ID!",
    });
  }
  const roomExists = roomsMetaDataNew.has(id);
  if (!roomExists) {
    return res.status(404).json({
      status: "fail",
      message: "Chat room not found!",
    });
  }
  res.status(200).json({
    status: "success",
    id,
  });
};

const createRoom = (req: Request, res: Response) => {
  const newId = generateUniqueId();
  const { name } = req.body;
  const date = getCurrentDate();
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
  if (!id) {
    return res.status(403).json({
      status: "fail",
      message: "Room ID missing! Please input the Room ID!",
    });
  }
  const roomExists = roomsMetaDataNew.has(id);
  if (!roomExists) {
    return res.status(404).json({
      status: "fail",
      message: "Chat room not found!",
    });
  }

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
  if (!id) {
    return res.status(403).json({
      status: "fail",
      message: "Room ID missing! Please input the Room ID!",
    });
  }
  const roomExists = roomsMetaDataNew.has(id);
  if (!roomExists) {
    return res.status(404).json({
      status: "fail",
      message: "Chat room not found!",
    });
  }

  roomsMetaDataNew.delete(id);
  res.status(204).json({
    status: "success",
    data: null,
  });
};

app.get("/api/v1/rooms", getRoomsCount); // Get rooms count
app.get("/api/v1/rooms/:id", checkIfRoomExists); // Get single room details (exists/not-exists)
app.post("/api/v1/rooms", createRoom); // Create new room
app.patch("/api/v1/rooms/:id", updateRoom); // Update room data/join room
app.delete("/api/v1/rooms/:id", deleteRoom); // Delete room

// =======

app.get("/chatRoomValidity");

app.post(
  "/joinRoom/:roomId",
  validateRoomDetails,
  (req: Request, res: Response) => {
    res.send(200);
  }
);

app.post(
  "/createRoom",
  checkRoomsLength,
  checkUserAuth,
  createNewRoom,
  (req: Request, res: Response) => {
    console.log("RES", res.locals);
    const newRoomId = res.locals.newRoomId;
    console.log("Rooms", roomWebSocketServers);
    if (!newRoomId) {
      res.status(500).send("Error creating room");
      return;
    }

    res.status(200).json({
      id: newRoomId,
    });
  }
);

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
