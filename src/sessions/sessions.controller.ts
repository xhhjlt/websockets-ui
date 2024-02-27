import { MessageTypes } from "../lib/messageTypes";
import { sessionsService } from "./sessions.service";

export const sessionsController = {
  sendToUser(id: number, type: MessageTypes, data: any) {
    const session = sessionsService.getSessionByUserId(id);
    if (session) {
      session.send(type, data);
    }
  }
}