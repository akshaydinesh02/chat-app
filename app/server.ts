import { createServer } from "http";
import {
  roomWebSocketServers,
  roomMetaDataServer,
} from "./helpers/rooms.helper";
import app from ".";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();

process.on("uncaughtException", (err: any) => {
  console.log("Unhandled exception! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const server = createServer(app);

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

server.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url || "", `http://${request.headers.host}`)
    .pathname;
  const roomId = pathname.split("/")[2];

  if (!pathname.includes("metadata") && roomWebSocketServers[roomId]) {
    roomWebSocketServers[roomId].handleUpgrade(request, socket, head, (ws) => {
      roomWebSocketServers[roomId].emit("connection", ws, request);
    });
  } else if (pathname.includes("metadata")) {
    roomMetaDataServer?.handleUpgrade(request, socket, head, (ws) => {
      roomMetaDataServer?.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(8080, () => {
  console.log("Room Server is listening on port 8080");
});

process.on("unhandledRejection", (err: any) => {
  console.log("Unhandled rejection! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
