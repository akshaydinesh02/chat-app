import { WebSocketServer } from "ws";
import { decrypt } from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import WebSocket from "ws";
import { IncomingMessage } from "http";
import url from "url";

export const roomsMetaDataNew = new Map<
  string,
  {
    id: string;
    createdAt: string;
    onlineUsers: Map<string, { name: string; id: string; email: string }>;
    allowedUsers: Map<string, string>;
  }
>([]);

export const roomWebSocketServers: { [key: string]: WebSocketServer } = {};

export const decryptNumber = (cipherText: string, secretKey: string) => {
  const bytes = decrypt(cipherText, secretKey);
  const originalNumber = bytes.toString(Utf8);
  return originalNumber;
};

export const broadcast = (wss: WebSocketServer, msg: WebSocket.Data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
};

export const removeOnlineUser = (user: any, roomId: string) => {
  const room = roomsMetaDataNew.get(roomId);
  room?.onlineUsers.delete(user.id);
};

export const addOnlineUser = (user: any, roomId: string) => {
  const room = roomsMetaDataNew.get(roomId);
  room?.onlineUsers.set(user.id, {
    name: user.name,
    id: user.id,
    email: user.email,
  });
};

export const createRoomServer = (newRoomId: string) => {
  const roomServer = new WebSocketServer({ noServer: true });
  roomWebSocketServers[newRoomId] = roomServer;

  roomServer.on("connection", (client: WebSocket, req: IncomingMessage) => {
    const parsedUrl = url.parse(req.url || "", true);
    const userId = parsedUrl.query.id as string;
    const userEmail = parsedUrl.query.email as string;
    const userName = parsedUrl.query.name as string;
    const connectedUser = { id: userId, email: userEmail, name: userName };
    console.log(`Client connected to room ${newRoomId}`);
    addOnlineUser(connectedUser, newRoomId);

    client.on("message", (msg: WebSocket.Data) => {
      console.log(`Message in room ${newRoomId}: ${msg}`);
      broadcast(roomServer, msg);
    });

    client.on("close", (_: number, data: string) => {
      const disconnectedUser = JSON.parse(data);
      removeOnlineUser(disconnectedUser, newRoomId);
      console.log(`Client disconnected from room ${newRoomId}`);
    });
  });
};

export const createMetadataServer = () => {
  const server = new WebSocketServer({
    noServer: true,
  });

  server.on("connection", (client: WebSocket, req: IncomingMessage) => {
    console.log("New client connected");
    client.send(roomsMetaDataNew.size.toString());
    // broadcast(server, "test");
  });

  return server;
};
export const roomMetaDataServer: WebSocketServer = createMetadataServer();
