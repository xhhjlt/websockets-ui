import { SessionHandler } from "../sessionHandler";

export interface User {
  index: number;
  name: string;
  password: string;
  wins?: number;
}

export interface Room {
  roomId: number;
  roomUsers: Pick<User, "name" | "index">[];
}

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

export interface BattleshipGame {
  gameId: number;
  players: {
    id: number;
    ships?: Ship[];
    field?: boolean[][];
  }[];
  currentPlayer: number;
}

export const db: {
  users: { data: User[]; lastId: number };
  gameRooms: { data: Room[]; lastId: number };
  games: BattleshipGame[]
  sessions: SessionHandler[];
} = {
  users: { data: [], lastId: 0 },
  gameRooms: { data: [], lastId: 0 },
  games: [],
  sessions: [],
};
