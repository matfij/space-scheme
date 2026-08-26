import type { ShipResource } from "./types";

export type ShipGuid = "ship-falco" | "ship-aegis" | "ship-leon" | "ship-havoc";

export type ShipAbilityGuid = "laser-barrage";

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
    rotationSpeed: 3,
    projectTileCooldown: 50,
    projectileGuids: ["proj-swift-laser", "proj-swift-laser"],
    ability: {
        guid: "laser-barrage",
        duration: 5,
        cooldown: 30,
    },
    sprite: {
        type: "Polygon",
        width: 2,
        color: "#3ad",
        coordinates: [
            [18, 0],
            [4, -6],
            [-14, -9],
            [-6, 0],
            [-14, 9],
            [4, 6],
        ],
    },
};

export const AEGIS: ShipResource = {
    guid: "ship-aegis",
    name: "Aegis",
    type: "Ship",
    health: 1200,
    shield: 300,
    shieldRegeneration: 30,
    radius: 15,
    mass: 90,
    drag: 0.994,
    maxSpeed: 200,
    acceleration: 600,
    rotationSpeed: 2,
    projectTileCooldown: 90,
    projectileGuids: ["proj-heavy-laser", "proj-heavy-laser"],
    ability: {
        guid: "laser-barrage",
        duration: 5,
        cooldown: 30,
    },
    sprite: {
        type: "Polygon",
        width: 2,
        color: "rgb(175, 240, 44)",
        coordinates: [
            [20, 0],
            [8, -12],
            [-10, -16],
            [-20, -6],
            [-20, 6],
            [-10, 16],
            [8, 12],
        ],
    },
};

export const LEON: ShipResource = {
    guid: "ship-leon",
    name: "Leon",
    type: "Ship",
    health: 800,
    shield: 100,
    shieldRegeneration: 10,
    radius: 13,
    mass: 60,
    drag: 0.994,
    maxSpeed: 260,
    acceleration: 800,
    rotationSpeed: 2.5,
    projectTileCooldown: 60,
    projectileGuids: ["proj-swift-laser", "proj-swift-laser", "proj-swift-laser"],
    ability: {
        guid: "laser-barrage",
        duration: 5,
        cooldown: 30,
    },
    sprite: {
        type: "Polygon",
        width: 2,
        color: "rgb(234, 165, 39)",
        coordinates: [
            [20, 0],
            [6, -4],
            [3, -14],
            [-4, -14],
            [-6, -6],
            [-16, -10],
            [-12, -2],
            [-12, 2],
            [-16, 10],
            [-6, 6],
            [-4, 14],
            [3, 14],
            [6, 4],
        ],
    },
};

export const HAVOC: ShipResource = {
    guid: "ship-havoc",
    name: "Havoc",
    type: "Ship",
    health: 1200,
    shield: 0,
    shieldRegeneration: 0,
    radius: 14,
    mass: 70,
    drag: 0.994,
    maxSpeed: 270,
    acceleration: 800,
    rotationSpeed: 2.7,
    projectTileCooldown: 60,
    projectileGuids: ["proj-swift-laser", "proj-heavy-laser", "proj-swift-laser"],
    ability: {
        guid: "laser-barrage",
        duration: 5,
        cooldown: 30,
    },
    sprite: {
        type: "Polygon",
        width: 2,
        color: "rgb(194, 43, 244)",
        coordinates: [
            [26, 0],
            [7, 5],
            [5, 15],
            [-3, 8],
            [-13, 9],
            [-8, 0],
            [-13, -9],
            [-3, -8],
            [5, -15],
            [6, -6],
        ],
    },
};

export const GAME_SHIPS = {
    [FALCO.guid]: FALCO,
    [AEGIS.guid]: AEGIS,
    [LEON.guid]: LEON,
    [HAVOC.guid]: HAVOC,
} as const;
