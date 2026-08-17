import type { EntityKind } from "../entities";
import type { AlienGuid } from "./aliens";
import type { AsteroidGuid } from "./asteroids";
import type { ProjectileGuid } from "./projectiles";
import type { ShipGuid } from "./ships";

export type GameMap = {
    guid: string;
    name: string;
    imageUri: string;
    gridSize: number;
    width: number;
    height: number;
    asteroids: { guid: AsteroidGuid; cooldown: number }[];
    aliens: { guid: AlienGuid; limit: number }[];
};

export type GameResource<T> = {
    guid: T;
    type: EntityKind;
    radius: number;
    mass: number;
    sprite: { color: string; width: number } & (
        | { type: "Circle"; radius: number; isAsteroid?: boolean }
        | { type: "Polygon"; coordinates: number[][] }
    );
} & (
    | {
          type: "Ship";
          name: string;
          health: number;
          shield: number;
          shieldRegeneration: number;
          drag: number;
          maxSpeed: number;
          acceleration: number;
          rotationSpeed: number;
          projectTileCooldown: number;
          projectileGuids: ProjectileGuid[];
      }
    | {
          type: "Alien";
          name: string;
          health: number;
          shield: number;
          shieldRegeneration: number;
          drag: number;
          maxSpeed: number;
          acceleration: number;
          rotationSpeed: number;
          projectTileCooldown: number;
          projectileGuids: ProjectileGuid[];
      }
    | {
          type: "Asteroid";
          health: number;
          maxSpeed: number;
      }
    | {
          type: "Projectile";
          speed: number;
          range: number;
          damage: number;
      }
);

export type ShipResource = Extract<GameResource<ShipGuid>, { type: "Ship" }>;

export type AlienResource = Extract<GameResource<AlienGuid>, { type: "Alien" }>;

export type AsteroidResource = Extract<GameResource<AsteroidGuid>, { type: "Asteroid" }>;

export type ProjectileResource = Extract<GameResource<ProjectileGuid>, { type: "Projectile" }>;
