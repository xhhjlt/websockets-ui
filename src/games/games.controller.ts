import { Ship } from "../db";
import { roomsService } from "../rooms/rooms.service";
import { gamesService } from "./games.service";

export const gamesController = {
  createGame(room) {
    const game = gamesService.createGame(room);
    roomsService.deleteRoom(room.roomId);
    return game;
  },

  addShips(gameId: number, playerId: number, ships: Ship[]) {
    const game = gamesService.addShips(gameId, playerId, ships);
    if (game?.players.length === 1) {
      const readyGame = gamesService.setTurn(gameId, game.players[0].id);
      return readyGame;
    }
    return game;
  },

  attack(gameId: number, playerId: number, x: number, y: number) {
    const game = gamesService.attack(gameId, playerId, x, y);
    return game;
  }
}