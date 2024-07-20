import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
import express from "express";
import cors from "cors";
import {
  checkRoomsLength,
  createNewRoom,
  validateRoomDetails,
} from "./middleware/rooms.middleware";
import { roomWebSocketServers } from "./helpers/rooms.helper";

import morgan from "morgan";
import { default as roomRouter } from "./routes/roomRoutes";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Router
app.use("/api/v1/rooms", roomRouter);

// =======

// app.get("/chatRoomValidity");

// app.post(
//   "/joinRoom/:roomId",
//   validateRoomDetails,
//   (req: Request, res: Response) => {
//     res.send(200);
//   }
// );

// app.post(
//   "/createRoom",
//   checkRoomsLength,
//   checkUserAuth,
//   createNewRoom,
//   (req: Request, res: Response) => {
//     console.log("RES", res.locals);
//     const newRoomId = res.locals.newRoomId;
//     console.log("Rooms", roomWebSocketServers);
//     if (!newRoomId) {
//       res.status(500).send("Error creating room");
//       return;
//     }

//     res.status(200).json({
//       id: newRoomId,
//     });
//   }
// );

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
