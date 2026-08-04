export type EntityKind = "Ship" | "Alien" | "Asteroid" | "Projectile";

export type BaseEntity<T extends EntityKind> = {
    type: T;
    id: string;
    resourceId: string;
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
};

export type ShipEntity = BaseEntity<"Ship"> & {
    rot: number;
    tRot: number;
    inputs: string[];
};

export type AlienEntity = BaseEntity<"Alien">;

export type ProjectileEntity = BaseEntity<"Projectile"> & {
    shooterId: string;
    traveled: number;
    travelLimit: number;
};

export type AsteroidEntity = BaseEntity<"Asteroid">;

export type GameEntity = ShipEntity | AsteroidEntity | ProjectileEntity;
