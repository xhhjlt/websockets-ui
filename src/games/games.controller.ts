import { AppError } from "../appError/appError";
import { Ship } from "../db";
import { AttackResults } from "../lib/attackResults";
import { MessageTypes } from "../lib/messageTypes";
import { roomsService } from "../rooms/rooms.service";
import { usersService } from "../users/users.service";
import { gamesService } from "./games.service";

export const gamesController = {
  createGame(room) {
    const game = gamesService.createGame(room);
    roomsService.deleteRoom(room.roomId);
    return game;
  },

  addShips(gameId: number, playerId: number, ships: Ship[]) {
    const game = gamesService.addShips(gameId, playerId, ships);
    if (game?.players?.every((player) => player.ships)) {
      const firstPlayer = Math.random() > 0.5? game.players[0].id : game.players[1].id;
      const readyGame = gamesService.setTurn(gameId, firstPlayer);
      return readyGame;
    }
  },

  attack(gameId: number, playerId: number, x?: number, y?: number) {
    const game = gamesService.getGame(gameId);
    if (!game || playerId !== game.currentPlayer) {
      throw new AppError(MessageTypes.ATTACK, "Not your turn");
    }
    const results = gamesService.attack(gameId, playerId, x, y);
    if (results[0].status === AttackResults.MISS) {
      gamesService.changeTurn(gameId);
    }
    if (results[0].status === AttackResults.WIN) {
      usersService.addWin(playerId);
      gamesService.deleteGame(gameId);
    }
    return {results, game};
  },
};
