import { WebSocketServer } from "ws";
import { decrypt } from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import WebSocket from "ws";

export const roomsMetaData = new Map<string, number>();

export const roomsMetaDataNew = new Map<
  string,
  {
    id: string;
    createdAt: string;
    users: Map<string, { name: string; id: string }>;
    allowedUsers: Map<string, string>;
  }
>([
  // [
  //   "tax-223-xg",
  //   {
  //     id: "tax-223-xg",
  //     createdAt: "test",
  //     users: new Map([["12345", { name: "Akshay", id: "12345" }]]),
  //     pin: "1234",
  //   },
  // ],
]);

export const checkIfRoomExist = (roomId: string) => roomsMetaData.has(roomId);

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
