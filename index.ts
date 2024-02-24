import { WebSocketServer } from "ws";
import { httpServer } from "./src/http_server/index";
import { SessionHandler } from "./src/sessionHandler";

const HTTP_PORT = 8181;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Static http server started on the ${HTTP_PORT} port!`);
});

const socketServer = new WebSocketServer({ port: 3000 }, () => {
  console.log("Socket server started on the 3000 port!");
});
socketServer.on("connection", (ws) => {
  console.log("Client connected!");
  new SessionHandler(ws, socketServer);
});

socketServer.on("close", () => {
  socketServer.clients.forEach((client) => {
    client.send(JSON.stringify({ type: "close" }));
    client.terminate()}
    );
  console.log("Socket server closed!");
});
