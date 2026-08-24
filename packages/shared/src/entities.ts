import type { ResourceGuid, ShipAbilityGuid } from "./resources";

export type EntityKind = "Ship" | "Alien" | "Asteroid" | "Projectile";

export type BaseEntity<T extends EntityKind> = {
    type: T;
    id: string;
    resourceGuid: ResourceGuid;
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
};

export type ShipEntity = BaseEntity<"Ship"> & {
    name: string;
    hp: number;
    sp: number;
    rot: number;
    tRot: number;
    respawnProgress: number;
    inputs: string[];
    ability: {
        guid: ShipAbilityGuid;
        timeLeft: number;
        cooldown: number;
    }
};

export type AlienEntity = BaseEntity<"Alien"> & {
    name: string;
    hp: number;
    sp: number;
    rot: number;
    tRot: number;
    target: { id?: string; x: number; y: number };
};

export type ProjectileEntity = BaseEntity<"Projectile"> & {
    rot: number;
    shooterId: string;
    traveled: number;
    travelLimit: number;
};

export type AsteroidEntity = BaseEntity<"Asteroid"> & {
    hp: number;
};

export type GameEntity = ShipEntity | AlienEntity | AsteroidEntity | ProjectileEntity;
