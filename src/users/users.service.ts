import { User, db } from "../db";

export const usersService = {
  addUser(user: User) {
    db.users.push(user);
    return {
      name: user.name,
      index: db.users.length - 1
    };
  },
  getUserByName(name: string) {
    const index = db.users.findIndex((user) => user.name === name);
    if (index === -1) {
      return null;
    } else {
      return {
        ...db.users[index],
        index
      };
    }
  },
  getAllUsers() {
    return db.users
  },
  updateUser(user: Partial<User>) {
    const index = db.users.findIndex((u) => u.name === user.name);
    if (index === -1) {
      return null;
    } else {
      db.users[index] = { ...db.users[index], ...user };
    }
  }
}