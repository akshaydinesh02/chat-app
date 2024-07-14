import { WebSocketServer } from "ws";
import { createServer } from "http";
import WebSocket from "ws";
import { Response, Request, NextFunction } from "express";
import express from "express";
import cors from "cors";
import { checkRoomsLength, createNewRoom } from "./middleware/rooms.middleware";
import { checkUserAuth } from "./middleware/auth.middleware";
import { validateUserData } from "./middleware/zod.middleware";
import { rooms } from "./helpers/rooms.helper";

const app = express();

app.use(cors());

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
  "/createRoom",
  checkRoomsLength,
  checkUserAuth,
  createNewRoom,
  (req: Request, res: Response) => {
    console.log("FINAL", rooms);
    res.json({
      status: "success",
      data: {
        test: "TEST",
      },
    });
  }
);

app.listen(3060, () => {
  // console.log("App listening on port 3060");
});
