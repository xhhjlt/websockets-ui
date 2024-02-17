import { WebSocketServer } from "ws";
import { httpServer } from "./src/http_server/index.js";
import { usersController } from "./src/users/users.controller.js";

const HTTP_PORT = 8181;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Static http server started on the ${HTTP_PORT} port!`);
});

const socketServer = new WebSocketServer({ port: 3000 });
socketServer.on("connection", (ws) => {
  const sendAll = ({ type, data }) => socketServer.clients.forEach((client) => client.send(JSON.stringify({ id: 0, type, data })));
  ws.on("message", (raw: string) => {
    const response = JSON.parse(raw);
    const { type, id, data: rawData } = response;
    const data = JSON.parse(rawData);
    const send = (data) => ws.send(JSON.stringify({ id, type, data }));
    const winners = usersController.getWinners();
    const updateWinners = () => sendAll({ type: "update_winners", data: JSON.stringify(winners) });
    if (type === "reg") {
      const respData = usersController.login(data);
      send(JSON.stringify(respData));
      updateWinners();
    }
  });
});
