import { WebSocket, WebSocketServer } from "ws";
import { MessageTypes } from "./lib/messageTypes";
import { usersController } from "./users/users.controller";
import { AppError } from "./appError/appError";
import { roomsController } from "./rooms/rooms.controller";
import { sessionsService } from "./sessions/sessions.service";

const hour = 1000 * 60 * 60;

export class SessionHandler {
  user: { name: string; index: number };
  server: WebSocketServer;
  ws: WebSocket;

  constructor(ws: WebSocket, server: WebSocketServer) {
    this.ws = ws;
    this.server = server;
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
    ws.on("message", (raw) => this.onMessage(raw.toString()));
    ws.on("close", () => this.onClose());
  }
  startSession(user: { name: string; index: number }) {
    this.user = user;
    sessionsService.addSession(this);
  }

  send(type: MessageTypes, raw: any) {
    const data = JSON.stringify(raw);
    const resp = JSON.stringify({ type, id: 0, data });
    this.ws.send(resp);
  }

  sendAll(type: MessageTypes, raw: any) {
    const data = JSON.stringify(raw);
    const resp = JSON.stringify({ type, id: 0, data });
    this.server.clients.forEach((client) => client.send(resp));
  }

  onMessage(raw: string) {
    try {
      const response = JSON.parse(raw);
      const { type, data: rawData } = response;
      const data = JSON.parse(rawData);
      const updateWinners = () =>
        this.sendAll(MessageTypes.UPDATE_WINNERS, usersController.getWinners());
      const updateRooms = () => this.sendAll(MessageTypes.UPDATE_ROOM, roomsController.getRooms());
      if (type === MessageTypes.AUTH) {
        const respData = usersController.login(data);
        this.startSession({ name: respData.name, index: respData.index });
        this.send(MessageTypes.AUTH, respData);
        updateWinners();
        updateRooms();
      } else if (type === MessageTypes.CREATE_ROOM) {
        const respData = roomsController.createRoom(data);
        this.send(MessageTypes.CREATE_ROOM, respData);
        updateRooms();
      } else if (type === MessageTypes.ADD_USER_TO_ROOM) {
        const room = roomsController.addUserToRoom(data.indexRoom, this.user);
        updateRooms();
      }
    } catch (error) {
      if (error instanceof AppError) {
        this.send(error.type, { error: true, errorText: error.message });
        return;
      }
      this.send(MessageTypes.ERROR, {
        error: true,
        errorText: error.message,
      });
    }
  }

  onClose() {
    setTimeout(() => {
      sessionsService.deleteSession(this);
    }, hour);
  }
}