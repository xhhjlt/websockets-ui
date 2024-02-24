import { AppError } from "../appError/appError";
import { MessageTypes } from "../lib/messageTypes";
import { usersService } from "./users.service";

export const usersController = {
  login(data: { name: string; password: string }) {
    const user = usersService.getUserByName(data.name);
    if (!user) {
      return usersService.addUser({ name: data.name, password: data.password });
    }
    if (user.password !== data.password) {
      throw new AppError(MessageTypes.AUTH, "Wrong password");
    }
    return { name: user.name, index: user.index };
  },
  getWinners() {
    console.log(usersService.getAllUsers());
    return usersService.getAllUsers().filter((user) => !!user.wins).sort((a, b) => (b.wins || 0) - (a.wins || 0));
  }
}