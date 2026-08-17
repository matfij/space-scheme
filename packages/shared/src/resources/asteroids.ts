import type { AsteroidResource } from "./types";

export type AsteroidGuid = "ast-small-ball" | "ast-med-ball" | "ast-large-ball" | "ast-super-ball";

export const SMALL_BALL: AsteroidResource = {
    guid: "ast-small-ball",
    type: "Asteroid",
    health: 1000,
    radius: 25,
    mass: 250,
    maxSpeed: 150,
    sprite: {
        type: "Circle",
        width: 2,
        color: "rgb(47, 53, 75)",
        radius: 25,
        isAsteroid: true,
    },
};

export const MED_BALL: AsteroidResource = {
    guid: "ast-med-ball",
    type: "Asteroid",
    health: 3400,
    radius: 35,
    mass: 550,
    maxSpeed: 120,
    sprite: {
        type: "Circle",
        width: 2,
        color: "rgb(65, 51, 74)",
        radius: 35,
        isAsteroid: true,
    },
};

export const LARGE_BALL: AsteroidResource = {
    guid: "ast-large-ball",
    type: "Asteroid",
    health: 10_000,
    radius: 80,
    mass: 2000,
    maxSpeed: 100,
    sprite: {
        type: "Circle",
        width: 3,
        color: "rgb(57, 66, 23)",
        radius: 80,
        isAsteroid: true,
    },
};

export const SUPER_BALL: AsteroidResource = {
    guid: "ast-super-ball",
    type: "Asteroid",
    health: 100_000,
    radius: 200,
    mass: 20_000,
    maxSpeed: 100,
    sprite: {
        type: "Circle",
        width: 5,
        color: "rgb(201, 239, 247)",
        radius: 200,
        isAsteroid: true,
    },
};

export const GAME_ASTEROIDS = {
    [SMALL_BALL.guid]: SMALL_BALL,
    [MED_BALL.guid]: MED_BALL,
    [LARGE_BALL.guid]: LARGE_BALL,
    [SUPER_BALL.guid]: SUPER_BALL,
} as const;
