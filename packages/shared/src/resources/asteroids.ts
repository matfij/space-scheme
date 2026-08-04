import { AsteroidResource } from "./types";

export const SMALL_BALL: AsteroidResource = {
    id: "asteroid-small-ball",
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

export const GAME_ASTEROIDS: Record<string, AsteroidResource> = {
    [SMALL_BALL.id]: SMALL_BALL,
} as const;

export type AsteroidId = keyof typeof GAME_ASTEROIDS;
