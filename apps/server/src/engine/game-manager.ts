import {
    AsteroidEntity,
    ShipEntity,
    ProjectileEntity,
    GameState,
    safeSerialize,
} from "@space/shared";

import { AsteroidManager } from "./asteroid-manager";
import { CollisionManager } from "./collision-manager";
import { ProjectilesManger } from "./projectiles-manager";
import { ShipManager } from "./ship-manager";

export class GameManager {
    private ships: ShipEntity[] = [];
    private asteroids: AsteroidEntity[] = [];
    private projectiles: ProjectileEntity[] = [];

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

    hasShip = (id: string) => !!this.ships.find((ship) => ship.id === id);

    removeShip(id: string) {
        this.ships = this.ships.filter((ship) => ship.id !== id);
    }

    addAsteroid(x: number, y: number) {
        const newAsteroid = AsteroidManager.createAsteroid(x, y);
        this.asteroids.push(newAsteroid);
    }

    update(dt: number) {
        this.moveShips(dt);
        ProjectilesManger.moveProjectiles(dt, this.projectiles);
        this.moveAsteroids(dt);
        // TODO - optimize: https://claude.ai/chat/31ca59db-b4df-429b-ba04-72e9ee9ab929
        CollisionManager.checkCollisions([...this.ships, ...this.asteroids, ...this.projectiles]);
    }

    moveShips(dt: number) {
        for (const ship of this.ships) {
            ShipManager.moveShip(dt, ship, this.projectiles);
        }
    }

    moveAsteroids(dt: number) {
        for (const asteroid of this.asteroids) {
            AsteroidManager.moveAsteroid(dt, asteroid);
        }
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
                resourceId: projectile.resourceId,
                x: projectile.x,
                y: projectile.y,
            })),
        };

        return safeSerialize(state);
    }
}
