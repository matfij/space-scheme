import type { ShipResource } from "./types";

export type ShipGuid = "ship-leon" | "ship-bastion";

export const LEON: ShipResource = {
    guid: "ship-leon",
    type: "Ship",
    health: 500,
    shield: 100,
    shieldRegeneration: 10,
    radius: 10,
    mass: 20,
    drag: 0.992,
    maxSpeed: 300,
    acceleration: 1000,
    projectTileCooldown: 60,
    projectileGuid: "proj-swift-laser",
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
    [LEON.guid]: LEON,
} as const;
