import { User, db } from "../db";

export const usersService = {
  addUser(user: Omit<User, "index">) {
    const index = db.users.lastId + 1;
    db.users.data.push({ ...user, index });
    db.users.lastId = index;
    return {
      name: user.name,
      index,
    };
  },
  getUserByName(name: string) {
    return db.users.data.find((user) => user.name === name);
  },
  getUserById(id: number) {
    return db.users.data.find((user) => user.index === id);
  },
  getAllUsers() {
    return db.users.data;
  },
  addWin(id) {
    const userData = db.users.data.find((user) => user.index === id);
    if (!userData) {
      return null;
    } else {
      userData.wins = userData.wins ? userData.wins + 1 : 1;
    }
  },
};
