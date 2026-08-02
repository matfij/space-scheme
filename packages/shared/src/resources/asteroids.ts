import { GameResource } from "./types";

export const SMALL_BALL: GameResource = {
    id: "asteroid-small-ball",
    type: "Asteroid",
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
    [SMALL_BALL.id]: SMALL_BALL,
} as const satisfies Record<string, GameResource>;

export type AsteroidId = keyof typeof GAME_ASTEROIDS;
