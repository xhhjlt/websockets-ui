import { AppError } from "../appError/appError";
import { Room, Ship, db } from "../db";
import { AttackResults } from "../lib/attackResults";
import { MessageTypes } from "../lib/messageTypes";

export const gamesService = {
  createGame: (room: Room) => {
    const game = {
      gameId: room.roomId,
      players: [
        {
          id: room.roomUsers[0].index,
          field: Array(10).fill(null)
            .map(() => Array(10).fill(false)),
        },
        {
          id: room.roomUsers[1].index,
          field: Array(10).fill(null)
            .map(() => Array(10).fill(false)),
        },
      ],
      currentPlayer: room.roomUsers[0].index,
    };
    db.games.push(game);
    return game;
  },

  getGame: (gameId: number) => {
    return db.games.find((game) => game.gameId === gameId);
  },

  addShips: (gameId: number, playerId: number, ships: Ship[]) => {
    const game = db.games.find((game) => game.gameId === gameId);
    const player = game?.players.find((player) => player.id === playerId);
    if (!player) {
      return null;
    }
    player.ships = ships.map((ship) => {
      const points = Array(ship.length)
        .fill(null)
        .map((_, index) => {
          const point = {
            x: ship.position.x,
            y: ship.position.y,
          };
          if (ship.direction) {
            point.y += index;
          } else {
            point.x += index;
          }
          return point;
        });

      return {
        ...ship,
        points,
      };
    });
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

  changeTurn: (gameId: number) => {
    const game = db.games.find((game) => game.gameId === gameId);
    if (!game) {
      return null;
    }
    if (game.currentPlayer === game.players[0].id) {
      game.currentPlayer = game.players[1].id;
    } else {
      game.currentPlayer = game.players[0].id;
    }
    return game;
  },

  attack: (gameId: number, playerId: number, x?: number, y?: number) => {
    const game = db.games.find((game) => game.gameId === gameId);
    const enemy = game?.players.find((player) => player.id !== playerId);
    if (!enemy || !game) {
      throw new AppError(MessageTypes.ATTACK, "Enemy not found");
    }
    if (!!enemy.field[x][y]) {
      throw new AppError(MessageTypes.ATTACK, "Already attacked");
    }
    enemy.field[x][y] = true;
    const ship = enemy?.ships?.find((ship) =>
      {
        const point = ship.points.find((p) => p.x === x && p.y === y)
        if (point) {
          point.hit = true;
        }
        return !!point
      }
    );
    if (!ship) {
      return [{status : AttackResults.MISS, x, y}];
    }
    const isAlive = ship.points.filter((p) => !p.hit).length;
    if (isAlive) {
      return [{status : AttackResults.SHOT, x, y}];
    } else {
      if (enemy.ships?.length === 1) {
        return [{status : AttackResults.WIN, x, y}];
      } else {
        enemy.ships = enemy.ships?.filter((playerShip) => playerShip !== ship);
        return [{status : AttackResults.KILLED, x, y}];
      }
    }
  },

  deleteGame: (gameId: number) => {
    db.games = db.games.filter((game) => game.gameId !== gameId);
  },
};
