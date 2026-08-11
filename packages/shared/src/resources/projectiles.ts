import type { ProjectileResource } from "./types";

export type ProjectileGuid = "proj-swift-laser" | "proj-heavy-laser";

export const SWIFT_LASER: ProjectileResource = {
    guid: "proj-swift-laser",
    type: "Projectile",
    radius: 1,
    mass: 1,
    speed: 1100,
    range: 700,
    damage: 10,
    sprite: {
        type: "Polygon",
        color: "rgb(225, 215, 18)",
        width: 1,
        coordinates: [
            [0, 0],
            [2, 0],
        ],
    },
} as const;

export const HEAVY_LASER: ProjectileResource = {
    guid: "proj-heavy-laser",
    type: "Projectile",
    radius: 2,
    mass: 1,
    speed: 700,
    range: 900,
    damage: 20,
    sprite: {
        type: "Polygon",
        color: "rgb(247, 156, 9)",
        width: 2,
        coordinates: [
            [0, 0],
            [4, 0],
        ],
    },
} as const;

export const GAME_PROJECTILES = {
    [SWIFT_LASER.guid]: SWIFT_LASER,
    [HEAVY_LASER.guid]: HEAVY_LASER,
} as const;
