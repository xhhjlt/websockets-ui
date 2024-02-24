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
    const arrIndex = db.users.data.findIndex((user) => user.index === id);
    if (arrIndex === -1) {
      return null;
    } else {
      db.users[arrIndex] = { ...db.users[arrIndex], wins: (db.users[arrIndex]?.wins || 0) + 1 };
      return db.users[arrIndex];
    }
  },
};
