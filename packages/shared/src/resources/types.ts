import type { EntityKind } from "../entities";

export type GameResource = {
    id: string;
    type: EntityKind;
    radius: number;
    mass: number;
    sprite: { color: string; width: number } & (
        | { type: "Circle"; radius: number }
        | { type: "Polygon"; coordinates: number[][] }
    );
} & (
    | {
          type: "Ship";
          drag: number;
          maxSpeed: number;
          acceleration: number;
          rotationSpeed: number;
          projectTileCooldown: number;
          projectileId: string;
      }
    | {
          type: "Alien";
          drag: number;
          maxSpeed: number;
          acceleration: number;
          rotationSpeed: number;
          projectTileCooldown: number;
          projectileId: string;
      }
    | {
          type: "Asteroid";
          maxSpeed: number;
      }
    | {
          type: "Projectile";
          speed: number;
          range: number;
      }
);

export type ShipResource = Extract<GameResource, { type: "Ship" }>;

export type AlienResource = Extract<GameResource, { type: "Alien" }>;

export type AsteroidResource = Extract<GameResource, { type: "Asteroid" }>;

export type ProjectileResource = Extract<GameResource, { type: "Projectile" }>;
