import {
    AsteroidEntity,
    GAME_SHIPS,
    ShipEntity,
    ProjectileEntity,
    GameEntity,
    EntityKind,
    GAME_ASTEROIDS,
    GameState,
    safeSerialize,
} from "@space/shared";

import { genId, randRange } from "../utils";
import { SpatialGrid } from "./collision-manager";

export class GameManager {
    private grid = new SpatialGrid();

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
        const resource = GAME_SHIPS[shipId];
        const newPlayer: ShipEntity = {
            id,
            type: "Ship",
            resourceId: shipId,
            radius: resource.radius,
            x: 0,
            y: 0,
            rot: 0,
            tRot: 0,
            vx: 0,
            vy: 0,
            inputs: [],
        };
        this.ships.push(newPlayer);
    }

    update(dt: number) {
        this.moveShips(dt);
        this.moveProjectiles(dt);
        this.moveAsteroids(dt);
        this.checkCollisions();
    }

    moveShips(dt: number) {
        for (const player of this.ships) {
            this.moveShip(dt, player);
        }
    }

    moveShip(dt: number, ship: ShipEntity) {
        let dx = 0;
        let dy = 0;
        const resource = GAME_SHIPS[ship.resourceId];

        if (ship.inputs.includes("KeyA")) {
            dx--;
        }
        if (ship.inputs.includes("KeyD")) {
            dx++;
        }
        if (ship.inputs.includes("KeyW")) {
            dy--;
        }
        if (ship.inputs.includes("KeyS")) {
            dy++;
        }
        if (ship.inputs.includes("KeyO")) {
            this.addProjectile(ship.id, ship.x, ship.y, resource.projectTileSpeed, ship.rot);
        }

        if (dx !== 0 || dy !== 0) {
            const length = Math.hypot(dx, dy);
            dx /= length;
            dy /= length;

            ship.vx += dx * dt * resource.acceleration;
            ship.vy += dy * dt * resource.acceleration;
            ship.tRot = Math.atan2(dy, dx);
        }

        const currentSpeed = Math.hypot(ship.vx, ship.vy);
        if (currentSpeed > resource.maxSpeed) {
            const scale = resource.maxSpeed / currentSpeed;
            ship.vx *= scale;
            ship.vy *= scale;
        }

        ship.x += ship.vx * dt;
        ship.y += ship.vy * dt;

        let dRot = ship.tRot - ship.rot;
        dRot = Math.atan2(Math.sin(dRot), Math.cos(dRot));
        const maxDRot = resource.rotationSpeed * dt;
        if (Math.abs(dRot) <= maxDRot) {
            ship.rot = ship.tRot;
        } else {
            ship.rot += Math.sign(dRot) * maxDRot;
        }

        ship.vx *= resource.drag;
        ship.vy *= resource.drag;
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
            asteroid.x += dt * asteroid.vx;
            asteroid.y += dt * asteroid.vy;
        }
    }

    checkCollisions() {
        const entities = [...this.ships, ...this.asteroids];
        this.grid.clear();
        entities.forEach((entity) => this.grid.insert(entity));
        const checked = new Set<string>();

        for (const a of entities) {
            for (const b of this.grid.nearby(a)) {
                if (a.id === b.id) {
                    continue;
                }
                const pairKey = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
                if (checked.has(pairKey)) {
                    continue;
                }
                checked.add(pairKey);
                const dxy = Math.hypot(a.x - b.x, a.y - b.y);
                if (dxy < a.radius + b.radius) {
                    this.resolveCollision(a, b);
                }
            }
        }
    }

    resolveCollision(a: GameEntity, b: GameEntity) {
        const key = [a.type, b.type].sort().join("-") as `${EntityKind}-${EntityKind}`;
        switch (key) {
            case "Asteroid-Ship": {
                const ship = a.type === "Ship" ? a : b;
                const asteroid = a.type === "Asteroid" ? a : b;
                ship.vx *= -1;
                ship.vy *= -1;
                // TODO - remove asteroid
                break;
            }
            case "Asteroid-Asteroid": {
                a.vx *= -1;
                a.vy *= -1;
                b.vx *= -1;
                b.vy *= -1;
                break;
            }
        }
    }

    addAsteroid(x: number, y: number) {
        const resource = GAME_ASTEROIDS["asteroid-small-ball"];
        this.asteroids.push({
            id: genId(),
            type: "Asteroid",
            resourceId: "asteroid-small-ball",
            radius: resource.radius,
            x,
            y,
            vx: randRange(-resource.maxSpeed, resource.maxSpeed),
            vy: randRange(-resource.maxSpeed, resource.maxSpeed),
        });
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
