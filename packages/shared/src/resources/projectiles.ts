import type { ProjectileResource } from "./types";

export type ProjectileGuid = "proj-swift-laser" | "proj-heavy-laser";

export const SWIFT_LASER: ProjectileResource = {
    guid: "proj-swift-laser",
    type: "Projectile",
    radius: 1,
    mass: 1,
    speed: 900,
    range: 900,
    damage: 10,
    sprite: {
        type: "Circle",
        color: "#f00",
        width: 1,
        radius: 1,
    },
} as const;

export const GAME_PROJECTILES = {
    [SWIFT_LASER.guid]: SWIFT_LASER,
} as const;
