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
          field: Array(10)
            .fill(null)
            .map(() => Array(10).fill(false)),
        },
        {
          id: room.roomUsers[1].index,
          field: Array(10)
            .fill(null)
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
    const coords = { x, y };
    if (coords.x === undefined || coords.y === undefined) {
      do {
        coords.x = Math.floor(Math.random() * 10);
        coords.y = Math.floor(Math.random() * 10);
      } while (!!enemy.field[coords.x][coords.y]);
    }
    if (!!enemy.field[coords.x][coords.y]) {
      throw new AppError(MessageTypes.ATTACK, "Already attacked");
    }
    enemy.field[coords.x][coords.y] = true;
    const ship = enemy?.ships?.find((ship) => {
      const point = ship.points.find(
        (p) => p.x === coords.x && p.y === coords.y
      );
      if (point) {
        point.hit = true;
      }
      return !!point;
    });
    if (!ship) {
      return [{ status: AttackResults.MISS, x: coords.x, y: coords.y }];
    }
    const isAlive = ship.points.filter((p) => !p.hit).length;
    if (isAlive) {
      return [{ status: AttackResults.SHOT, x: coords.x, y: coords.y }];
    } else {
      const results = ship.points.flatMap((point) => {
        const offsets = [-1, 0, 1];
        const surroundingPoints = offsets.flatMap(dx =>
          offsets.map(dy => ({ x: point.x + dx, y: point.y + dy }))
        ).filter(point => point.x >= 0 && point.x < 10 && point.y >= 0 && point.y < 10 && !enemy.field[point.x][point.y]);
        surroundingPoints.forEach(point => enemy.field[point.x][point.y] = true);
        return [{ status: AttackResults.KILLED, x: point.x, y: point.y }, ...surroundingPoints.map(point => ({ status: AttackResults.MISS, x: point.x, y: point.y }))];
      });
      enemy.ships = enemy.ships?.filter((playerShip) => playerShip !== ship);
      if (!enemy.ships?.length) {
        results.push({ status: AttackResults.WIN, x: coords.x, y: coords.y });
      }
      return results;
    }
  },

  deleteGame: (gameId: number) => {
    db.games = db.games.filter((game) => game.gameId !== gameId);
  },
};
