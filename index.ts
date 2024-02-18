import { WebSocketServer } from "ws";
import { httpServer } from "./src/http_server/index";
import { usersController } from "./src/users/users.controller";
import { SessionHandler } from "./src/sessionHandler";
import { AppError } from "./src/appError/appError";
import { MessageTypes } from "./src/lib/messageTypes";

const HTTP_PORT = 8181;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Static http server started on the ${HTTP_PORT} port!`);
});

const socketServer = new WebSocketServer({ port: 3000 });
socketServer.on("connection", (ws) => {
  new SessionHandler(ws, socketServer);
});
