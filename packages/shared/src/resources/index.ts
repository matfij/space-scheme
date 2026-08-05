import { GAME_ASTEROIDS } from "./asteroids";
import { GAME_PROJECTILES } from "./projectiles";
import { GAME_SHIPS } from "./ships";

export * from "./types";
export * from "./ships";
export * from "./asteroids";
export * from "./projectiles";

export const GAME_RESOURCES = {
    ...GAME_SHIPS,
    ...GAME_ASTEROIDS,
    ...GAME_PROJECTILES,
};
