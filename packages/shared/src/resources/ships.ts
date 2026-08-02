import { GameResource } from "./types";

export const LEON: GameResource = {
    id: "ship-leon",
    type: "Ship",
    radius: 10,
    mass: 20,
    drag: 0.992,
    maxSpeed: 300,
    acceleration: 1000,
    projectTileSpeed: 800,
    projectTileCooldown: 60,
    rotationSpeed: 3,
    sprite: {
        type: "Polygon",
        width: 2,
        color: "#3ad",
        coordinates: [
            [20, 0],
            [-10, -10],
            [-5, 0],
            [-10, 10],
        ],
    },
};

export const GAME_SHIPS = {
    [LEON.id]: LEON,
} as const;

export type ShipId = keyof typeof GAME_SHIPS;
