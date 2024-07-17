import { createServer } from "http";
import { Response, Request, NextFunction } from "express";
import express from "express";
import cors from "cors";
import {
  checkRoomsLength,
  createNewRoom,
  roomWebSocketServers,
  validateRoomDetails,
} from "./middleware/rooms.middleware";
import { checkUserAuth } from "./middleware/auth.middleware";
import { validateUserData } from "./middleware/zod.middleware";
import { rooms } from "./helpers/rooms.helper";
import { WebSocketServer } from "ws";

const app = express();

app.use(cors());
app.use(express.json());

const server = createServer(app);

server.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url || "", `http://${request.headers.host}`)
    .pathname;
  const roomId = pathname.split("/")[2];
  console.log("Pathname", pathname, roomId);

  if (roomWebSocketServers[roomId]) {
    roomWebSocketServers[roomId].handleUpgrade(request, socket, head, (ws) => {
      roomWebSocketServers[roomId].emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

// const server = createServer();
// const wss = new WebSocketServer({ server });
// // const messages =

// const MAX_CONNECTIONS = 2;
// let currentConnections = 0;

// wss.on("connection", (client: WebSocket) => {
//   if (currentConnections >= MAX_CONNECTIONS) {
//     client.send(JSON.stringify({ error: "Server is full. Try again later." }));
//     client.close();
//     return;
//   }

//   currentConnections++;
//   console.log("Client connected");

//   client.on("message", (msg: WebSocket.Data) => {
//     console.log(`Message: ${msg}`);
//     broadcast(msg);
//   });

//   client.on("close", () => {
//     currentConnections--;
//     console.log("Client disconnected!");
//   });
// });

// function broadcast(msg: WebSocket.Data) {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(msg);
//     }
//   });
// }

// server.listen(8080, () => {
//   console.log("Server is listening on port 8080");
// });

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
