import { db } from "../db";
import { SessionHandler } from "../sessionHandler";

export const sessionsService = {
  getAllSessions() {
    return db.sessions;
  },
  addSession(handler: SessionHandler) {
    db.sessions.push(handler);
  },
  deleteSession(handler: SessionHandler) {
    db.sessions = db.sessions.filter((session) => session !== handler);
  },
}