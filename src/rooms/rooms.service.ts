import { AppError } from "../appError/appError";
import { Room, User, db } from "../db";
import { MessageTypes } from "../lib/messageTypes";

export const roomsService = {
  getAllRooms() {
    return db.gameRooms.data;
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
    const room = db.gameRooms.data.find((room) => room?.roomId === roomId);
    if (!room) {
      throw new AppError(MessageTypes.ADD_USER_TO_ROOM, "Room not found");
    }
    if (room.roomUsers.find((user) => user.index === player.index)) {
      throw new AppError(MessageTypes.ADD_USER_TO_ROOM, "User already in room");
    }
    room.roomUsers.push(player);
    return room;
  },

  deleteRoom(roomId: number) {
    db.gameRooms.data = db.gameRooms.data.filter((room) => room.roomId !== roomId);
  }
};
