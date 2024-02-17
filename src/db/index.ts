export interface User {
  name: string;
  password: string;
  wins?: number;
}

export const db: { users: User[]; gameRooms: any[] } = {
  users: [],
  gameRooms: []
}