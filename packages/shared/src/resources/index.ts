import { GAME_ASTEROIDS, type AsteroidGuid } from "./asteroids";
import { GAME_PROJECTILES, type ProjectileGuid } from "./projectiles";
import { GAME_SHIPS, type ShipGuid } from "./ships";

export * from "./types";
export * from "./ships";
export * from "./asteroids";
export * from "./projectiles";
export * from "./maps";

export type ResourceGuid = ShipGuid | AsteroidGuid | ProjectileGuid;

export const GAME_RESOURCES = {
    ...GAME_SHIPS,
    ...GAME_ASTEROIDS,
    ...GAME_PROJECTILES,
};
