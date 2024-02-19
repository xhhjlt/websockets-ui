import { db } from "../db";
import { SessionHandler } from "../sessionHandler";

export const sessionsService = {
  getSessionByUserId(id: number) {
    return db.sessions.find((session) => session.user.index === id);
  },

  addSession(handler: SessionHandler) {
    db.sessions.push(handler);
  },
  deleteSession(handler: SessionHandler) {
    db.sessions = db.sessions.filter((session) => session !== handler);
  },
}