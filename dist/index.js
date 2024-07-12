"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http_1 = require("http");
const ws_2 = __importDefault(require("ws"));
const server = (0, http_1.createServer)();
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (client) => {
    console.log("Client connected!");
    client.on("message", (msg) => {
        console.log(`Message: ${msg}`);
        broadcast(msg);
    });
});
function broadcast(msg) {
    wss.clients.forEach((client) => {
        if (client.readyState === ws_2.default.OPEN) {
            client.send(msg);
        }
    });
}
server.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
