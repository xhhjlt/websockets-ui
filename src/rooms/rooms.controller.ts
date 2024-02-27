import { User } from "../db";
import { roomsService } from "./rooms.service";

export const roomsController = {
  getRooms() {
    return roomsService.getAllRooms();
  },

  createRoom(creator: Omit<User, "password" | "wins">) {
    return roomsService.createRoom(creator);
  },

  addUserToRoom(roomId: number, user: Omit<User, "password" | "wins">) {
    return roomsService.addPlayerToRoom(roomId, user);
  }
}