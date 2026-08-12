import type { AsteroidResource } from "./types";

export type AsteroidGuid = "ast-small-ball" | "ast-med-ball";

export const SMALL_BALL: AsteroidResource = {
    guid: "ast-small-ball",
    type: "Asteroid",
    health: 1000,
    radius: 25,
    mass: 250,
    maxSpeed: 140,
    sprite: {
        type: "Circle",
        width: 2,
        color: "rgb(47, 53, 75)",
        radius: 25,
    },
};

export const MED_BALL: AsteroidResource = {
    guid: "ast-med-ball",
    type: "Asteroid",
    health: 2400,
    radius: 35,
    mass: 550,
    maxSpeed: 100,
    sprite: {
        type: "Circle",
        width: 2,
        color: "rgb(168, 75, 230)",
        radius: 35,
    },
};

export const GAME_ASTEROIDS = {
    [SMALL_BALL.guid]: SMALL_BALL,
    [MED_BALL.guid]: MED_BALL,
} as const;
