export type EntityKind = "Player" | "Asteroid" | "Projectile";

export type BaseEntity<T extends EntityKind> = {
    type: T;
    id: string;
    mass: number;
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
};

export type PlayerEntity = BaseEntity<"Player"> & {
    rot: number;
    tRot: number;
    inputs: string[];
};

export type ProjectileEntity = BaseEntity<"Projectile">;

export type AsteroidEntity = BaseEntity<"Asteroid">;

export type GameEntity = PlayerEntity | AsteroidEntity | ProjectileEntity;
