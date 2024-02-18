import { Room, User, db } from "../db";

export const roomsService = {
  getAllRooms() {
    return db.gameRooms;
  },

  createRoom(creator: Omit<User, "password" | "wins">) {
    const roomId = db.gameRooms.lastId + 1;
    const roomData = {
      roomId,
      roomUsers: [creator],
    };
    db.gameRooms.data.push(roomData);
    db.gameRooms.lastId = roomId;
    return roomData;
  },

  addPlayerToRoom(roomId: number, player: Omit<User, "password" | "wins">) {
    const room = db.gameRooms.data.find((room) => room.roomId === roomId);
    if (!room) {
      return null;
    }
    room.roomUsers.push(player);
    return room;
  }
};
