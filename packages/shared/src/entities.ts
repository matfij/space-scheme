export type EntityKind = "Ship" | "Alien" | "Asteroid" | "Projectile";

export type BaseEntity<T extends EntityKind> = {
    type: T;
    id: string;
    resourceGuid: string;
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
};

export type AlienEntity = BaseEntity<"Alien"> & {
    hp: number;
    sp: number;
    rot: number;
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

export type GameEntity = ShipEntity | AsteroidEntity | ProjectileEntity;
