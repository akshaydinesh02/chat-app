import { Response, Request, NextFunction } from "express";
import express from "express";
import cors from "cors";

import morgan from "morgan";
import { default as roomRouter } from "./routes/roomRoutes";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/rooms", roomRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
