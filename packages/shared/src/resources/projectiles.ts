import type { ProjectileResource } from "./types";

export const SWIFT_LASER: ProjectileResource = {
    id: "projectile-swift-laser",
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
};

export const GAME_PROJECTILES: Record<string, ProjectileResource> = {
    [SWIFT_LASER.id]: SWIFT_LASER,
} as const;

export type ProjectileId = keyof typeof GAME_PROJECTILES;
