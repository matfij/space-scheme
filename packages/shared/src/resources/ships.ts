import type { ShipResource } from "./types";

export type ShipGuid = "ship-falco" | "ship-aegis" | "ship-leon";

export const FALCO: ShipResource = {
    guid: "ship-falco",
    name: "Falco",
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

export const AEGIS: ShipResource = {
    guid: "ship-aegis",
    name: "Aegis",
    type: "Ship",
    health: 1200,
    shield: 200,
    shieldRegeneration: 20,
    radius: 15,
    mass: 90,
    drag: 0.994,
    maxSpeed: 200,
    acceleration: 600,
    projectTileCooldown: 60,
    projectileGuid: "proj-swift-laser",
    rotationSpeed: 2,
    sprite: {
        type: "Polygon",
        width: 2,
        color: "rgb(175, 240, 44)",
        coordinates: [
            [23, 0],
            [7, -14],
            [-16, -5],
            [-16, 5],
            [7, 14],
        ],
    },
};

export const LEON: ShipResource = {
    guid: "ship-leon",
    name: "Leon",
    type: "Ship",
    health: 800,
    shield: 150,
    shieldRegeneration: 10,
    radius: 13,
    mass: 60,
    drag: 0.994,
    maxSpeed: 260,
    acceleration: 800,
    projectTileCooldown: 60,
    projectileGuid: "proj-swift-laser",
    rotationSpeed: 2.5,
    sprite: {
        type: "Polygon",
        width: 2,
        color: "rgb(234, 165, 39)",
        coordinates: [
            [22, 0],
            [8, -4],
            [2, -14],
            [-4, -14],
            [-6, -5],
            [-14, -3],
            [-14, 3],
            [-6, 5],
            [-4, 14],
            [2, 14],
            [8, 4],
        ],
    },
};

export const GAME_SHIPS = {
    [FALCO.guid]: FALCO,
    [AEGIS.guid]: AEGIS,
    [LEON.guid]: LEON,
} as const;
