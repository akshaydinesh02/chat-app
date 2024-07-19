import { createServer } from "http";
import { roomWebSocketServers } from "./helpers/rooms.helper";
import app from ".";

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

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
