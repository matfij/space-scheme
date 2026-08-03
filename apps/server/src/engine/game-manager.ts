import {
    AsteroidEntity,
    ShipEntity,
    ProjectileEntity,
    GameState,
    safeSerialize,
} from "@space/shared";

import { genId } from "../utils";
import { AsteroidManager } from "./asteroid-manager";
import { CollisionManager } from "./collision-manager";
import { ShipManager } from "./ship-manager";

export class GameManager {
    private ships: ShipEntity[] = [];
    private asteroids: AsteroidEntity[] = [];
    private projectiles: ProjectileEntity[] = [];

    hasShip = (id: string) => !!this.ships.find((ship) => ship.id === id);

    removeShip(id: string) {
        this.ships = this.ships.filter((ship) => ship.id !== id);
    }

    async initialize() {
        this.addAsteroid(200, 400);
        this.addAsteroid(300, 400);
        this.addAsteroid(400, 400);
        this.addAsteroid(500, 400);
        this.addAsteroid(600, 400);
        this.addAsteroid(600, 500);
        this.addAsteroid(600, 600);
        this.addAsteroid(600, 700);
    }

    setInputs(id: string, inputs: string[]) {
        this.ships.forEach((ship) => {
            if (ship.id === id) {
                ship.inputs = inputs;
                return;
            }
        });
    }

    addShip(id: string, shipId: string) {
        const newShip = ShipManager.createShip(id, shipId);
        this.ships.push(newShip);
    }

    update(dt: number) {
        this.moveShips(dt);
        this.moveProjectiles(dt);
        this.moveAsteroids(dt);
        CollisionManager.checkCollisions([...this.ships, ...this.asteroids]);
    }

    moveShips(dt: number) {
        for (const ship of this.ships) {
            ShipManager.moveShip(dt, ship);
        }
    }

    addProjectile(shooterId: string, x: number, y: number, v: number, rot: number) {
        this.projectiles.push({
            id: genId(),
            type: "Projectile",
            shooterId,
            resourceId: "TODO - projectile resources",
            radius: 1,
            x,
            y,
            vx: Math.cos(rot) * v,
            vy: Math.sin(rot) * v,
        });
    }

    moveProjectiles(dt: number) {
        for (const projectile of this.projectiles) {
            projectile.x += dt * projectile.vx;
            projectile.y += dt * projectile.vy;
        }
    }

    moveAsteroids(dt: number) {
        for (const asteroid of this.asteroids) {
            AsteroidManager.moveAsteroid(dt, asteroid);
        }
    }

    addAsteroid(x: number, y: number) {
        const newAsteroid = AsteroidManager.createAsteroid(x, y);
        this.asteroids.push(newAsteroid);
    }

    serialize() {
        const state: GameState = {
            ships: this.ships.map((ship) => ({
                id: ship.id,
                resourceId: ship.resourceId,
                x: ship.x,
                y: ship.y,
                rot: ship.rot,
            })),
            asteroids: this.asteroids.map((asteroid) => ({
                resourceId: asteroid.resourceId,
                x: asteroid.x,
                y: asteroid.y,
            })),
            projectiles: this.projectiles.map((projectile) => ({
                resourceId: "TODO",
                x: projectile.x,
                y: projectile.y,
            })),
        };

        return safeSerialize(state);
    }
}
