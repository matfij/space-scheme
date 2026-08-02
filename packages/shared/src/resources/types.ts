import { EntityKind } from "../entities";

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
          type: "Ship" | "Alien";
          drag: number;
          maxSpeed: number;
          acceleration: number;
          rotationSpeed: number;
          projectTileSpeed: number;
          projectTileCooldown: number;
      }
    | {
          type: "Asteroid";
          maxSpeed: number;
      }
    | { type: "Projectile" }
);

export type ShipResource = Extract<GameResource, { type: "Ship" }>;

export type AsteroidResource = Extract<GameResource, { type: "Asteroid" }>;
