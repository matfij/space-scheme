import {
    AsteroidEntity,
    ShipEntity,
    ProjectileEntity,
    GameState,
    safeSerialize,
    ShipGuid,
    GameMap,
    getRandomElement,
    gameConfig,
    GAME_SHIPS,
} from "@space/shared";

import { AsteroidManager } from "./asteroid-manager";
import { CollisionManager } from "./collision-manager";
import { ProjectilesManger } from "./projectiles-manager";
import { ShipManager } from "./ship-manager";
import { AsteroidSpawn } from "./types";

export class GameManager {
    private map: GameMap;

    private slowLoopProgress = 0;
    private slowLoopThreshold = 10 * gameConfig.dt;

    private ships: ShipEntity[] = [];
    private asteroids: AsteroidEntity[] = [];
    private projectiles: ProjectileEntity[] = [];

    private asteroidSpawns: AsteroidSpawn[] = [];

    constructor(map: GameMap) {
        this.map = map;
        this.asteroidSpawns = map.asteroids.map((asteroid) => ({
            guid: asteroid.guid,
            threshold: asteroid.cooldown,
            progress: 0,
        }));
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
        if (!this.ships.find((ship) => ship.id === id)) {
            const spawn = getRandomElement(this.map.spawnLocations);
            const newShip = ShipManager.createShip({ id, name, shipGuid, x: spawn.x, y: spawn.y });
            this.ships.push(newShip);
        }
    }

    update(dt: number) {
        ShipManager.moveShips(dt, this.ships, this.projectiles);

        ProjectilesManger.moveProjectiles(dt, this.projectiles);

        AsteroidManager.moveAsteroids(dt, this.asteroids);
        AsteroidManager.spawnAsteroids({
            dt,
            asteroids: this.asteroids,
            spawns: this.asteroidSpawns,
            map: this.map,
        });

        CollisionManager.checkCollisions([...this.ships, ...this.asteroids, ...this.projectiles]);

        this.checkDestruction();

        this.slowLoopProgress += dt;
        if (this.slowLoopProgress >= this.slowLoopThreshold) {
            CollisionManager.checkRadiation([...this.ships, ...this.asteroids], this.map);

            ShipManager.regenerateShields(this.ships);

            this.checkRespawn(this.slowLoopThreshold);

            this.slowLoopProgress = 0;
        }
    }

    private checkDestruction() {
        this.asteroids = this.asteroids.filter((asteroid) => asteroid.hp > 0);

        this.projectiles = this.projectiles.filter(
            (projectile) => projectile.traveled < projectile.travelLimit,
        );

        for (const ship of this.ships) {
            if (ship.isDestroyed || ship.hp > 0) {
                continue;
            }
            ship.isDestroyed = true;
            ship.vx = 0;
            ship.vx = 0;
            ship.tRot = 0;
            ship.respawnProgress = 0;
        }
    }

    private checkRespawn(dt: number) {
        for (const ship of this.ships) {
            if (!ship.isDestroyed) {
                continue;
            }
            if (ship.respawnProgress >= gameConfig.playerRespawnThreshold) {
                ship.isDestroyed = false;
                ship.respawnProgress = 0;

                const resource = GAME_SHIPS[ship.resourceGuid];
                ship.hp = resource.health;
                ship.sp = resource.shield;

                const spawn = getRandomElement(this.map.spawnLocations);
                ship.x = spawn.x;
                ship.y = spawn.y;
            } else {
                ship.respawnProgress += dt;
            }
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
