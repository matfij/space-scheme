import type { AsteroidResource } from "./types";

export type AsteroidGuid = "ast-small-ball" | "ast-med-ball";

export const SMALL_BALL: AsteroidResource = {
    guid: "ast-small-ball",
    type: "Asteroid",
    health: 1000,
    radius: 25,
    mass: 250,
    maxSpeed: 90,
    sprite: {
        type: "Circle",
        width: 2,
        color: "#daf",
        radius: 25,
    },
};

export const GAME_ASTEROIDS = {
    [SMALL_BALL.guid]: SMALL_BALL,
} as const;
