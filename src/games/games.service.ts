import { Room, Ship, db } from "../db";

export const gamesService = {
  createGame: (room: Room) => {
    const game = {
      gameId: room.roomId,
      players: [
        {
          id: room.roomUsers[0].index,
        },
        {
          id: room.roomUsers[1].index,
        },
      ],
      currentPlayer: room.roomUsers[0].index,
    };
    db.games.push(game);
    return game;
  },


  addShips: (gameId: number, playerId: number, ships: Ship[]) => {
    const game = db.games.find((game) => game.gameId === gameId);
    if (!game) {
      return null;
    }
    const player = game.players.find((player) => player.id === playerId);
    if (!player) {
      return null;
    }
    player.ships = ships;
    return game;
  },

  setTurn: (gameId: number, playerId: number) => {
    const game = db.games.find((game) => game.gameId === gameId);
    if (!game) {
      return null;
    }
    game.currentPlayer = playerId;
    return game;
  },

  attack: (gameId: number, playerId: number, x: number, y: number) => {
  }
};
