import { GAME_ALIENS, type AlienGuid } from "./aliens";
import { GAME_ASTEROIDS, type AsteroidGuid } from "./asteroids";
import { GAME_PROJECTILES, type ProjectileGuid } from "./projectiles";
import { GAME_SHIPS, type ShipGuid } from "./ships";

export * from "./types";
export * from "./ships";
export * from "./aliens";
export * from "./asteroids";
export * from "./projectiles";
export * from "./maps";

export type ResourceGuid = ShipGuid | AlienGuid | AsteroidGuid | ProjectileGuid;

export const GAME_RESOURCES = {
    ...GAME_SHIPS,
    ...GAME_ALIENS,
    ...GAME_ASTEROIDS,
    ...GAME_PROJECTILES,
} as const;
