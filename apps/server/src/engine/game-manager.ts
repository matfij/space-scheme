import {
    AsteroidEntity,
    ShipEntity,
    ProjectileEntity,
    GameState,
    safeSerialize,
    GameEntity,
    ShipGuid,
} from "@space/shared";

import { AsteroidManager } from "./asteroid-manager";
import { CollisionManager } from "./collision-manager";
import { ProjectilesManger } from "./projectiles-manager";
import { ShipManager } from "./ship-manager";

export class GameManager {
    private entities: GameEntity[] = [];
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

    addShip(id: string, name: string, shipGuid: ShipGuid) {
        const newShip = ShipManager.createShip(id, name, shipGuid);
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

        this.entities.length = 0;
        for (const ship of this.ships) {
            this.entities.push(ship);
        }
        for (const asteroid of this.asteroids) {
            this.entities.push(asteroid);
        }
        for (const projectile of this.projectiles) {
            this.entities.push(projectile);
        }
        CollisionManager.checkCollisions(this.entities);
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
                resourceGuid: ship.resourceGuid,
                name: ship.name,
                hp: ship.hp,
                sp: ship.sp,
                x: ship.x,
                y: ship.y,
                rot: ship.rot,
            })),
            asteroids: this.asteroids.map((asteroid) => ({
                id: asteroid.id,
                resourceGuid: asteroid.resourceGuid,
                hp: asteroid.hp,
                x: asteroid.x,
                y: asteroid.y,
            })),
            projectiles: this.projectiles.map((projectile) => ({
                id: projectile.id,
                resourceGuid: projectile.resourceGuid,
                x: projectile.x,
                y: projectile.y,
                rot: projectile.rot,
            })),
        };

        return safeSerialize(state);
    }
}
