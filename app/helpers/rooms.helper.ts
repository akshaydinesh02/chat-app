import { WebSocketServer } from "ws";

export const roomsMetaData = new Map<string, number>();

export const roomsMetaDataNew = new Map<
  string,
  {
    id: string;
    createdAt: string;
    users: Map<string, { name: string; id: string }>;
  }
>([
  [
    "tax-223-xg",
    {
      id: "tax-223-xg",
      createdAt: "test",
      users: new Map([["12345", { name: "Akshay", id: "12345" }]]),
    },
  ],
]);

export const checkIfRoomExist = (roomId: string) => roomsMetaData.has(roomId);

export const roomWebSocketServers: { [key: string]: WebSocketServer } = {};
