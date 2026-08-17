import type { AlienResource } from "./types";

export type AlienGuid = "alien-raider" | "alien-chef-raider";

export const RAIDER: AlienResource = {
    guid: "alien-raider",
    name: "-= RaideR =-",
    type: "Alien",
    health: 1200,
    shield: 300,
    shieldRegeneration: 10,
    radius: 25,
    mass: 120,
    drag: 0.994,
    maxSpeed: 150,
    acceleration: 400,
    projectTileCooldown: 90,
    projectileGuids: ["proj-heavy-laser"],
    rotationSpeed: 1.5,
    sprite: {
        type: "Polygon",
        width: 2,
        color: "rgb(248, 138, 27)",
        coordinates: [
            [25, 0],
            [14, -10],
            [16, -22],
            [0, -12],
            [-14, -20],
            [-20, -6],
            [-12, 0],
            [-20, 6],
            [-14, 20],
            [0, 12],
            [16, 22],
            [14, 10],
        ],
    },
};

export const CHEF_RAIDER: AlienResource = {
    guid: "alien-chef-raider",
    name: "+:: Chef Raider ::+",
    type: "Alien",
    health: 8000,
    shield: 400,
    shieldRegeneration: 20,
    radius: 35,
    mass: 240,
    drag: 0.994,
    maxSpeed: 180,
    acceleration: 700,
    projectTileCooldown: 90,
    projectileGuids: ["proj-heavy-laser", "proj-heavy-laser"],
    rotationSpeed: 1.75,
    sprite: {
        type: "Polygon",
        width: 2,
        color: "rgb(235, 142, 11)",
        coordinates: [
            [32, 0],
            [18, -8],
            [22, -26],
            [6, -16],
            [0, -30],
            [-8, -16],
            [-24, -22],
            [-18, -6],
            [-28, 0],
            [-18, 6],
            [-24, 22],
            [-8, 16],
            [0, 30],
            [6, 16],
            [22, 26],
            [18, 8],
        ],
    },
};

export const GAME_ALIENS = {
    [RAIDER.guid]: RAIDER,
    [CHEF_RAIDER.guid]: CHEF_RAIDER,
} as const;
