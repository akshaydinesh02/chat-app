import { WebSocketServer } from "ws";
import { createServer } from "http";
import WebSocket from "ws";

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (client: WebSocket) => {
  console.log("Client connected!");
  client.on("message", (msg: WebSocket.Data) => {
    console.log(`Message: ${msg}`);
    broadcast(msg);
  });
});

function broadcast(msg: WebSocket.Data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
