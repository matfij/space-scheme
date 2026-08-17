import {
    AsteroidEntity,
    ShipEntity,
    ProjectileEntity,
    GameState,
    ShipGuid,
    GameMap,
    gameConfig,
    GAME_SHIPS,
    GameStatistics,
    AlienEntity,
} from "@space/shared";

import { AlienManager } from "./alien-manager";
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
    private destroyedShips: ShipEntity[] = [];
    private aliens: AlienEntity[] = [];
    private asteroids: AsteroidEntity[] = [];
    private projectiles: ProjectileEntity[] = [];

    private asteroidSpawns: AsteroidSpawn[] = [];

    private statistics: GameStatistics;

    constructor(map: GameMap) {
        this.map = map;
        this.asteroidSpawns = map.asteroids.map((asteroid) => ({
            guid: asteroid.guid,
            threshold: asteroid.cooldown,
            progress: 0,
        }));
        this.statistics = {
            time: 0,
            leaderboard: {},
        };
    }

    joinPlayer(id: string, name: string, shipGuid: ShipGuid) {
        if (!this.ships.find((ship) => ship.id === id)) {
            const newShip = ShipManager.createShip({ id, name, shipGuid, map: this.map });
            this.ships.push(newShip);
            this.statistics.leaderboard[id] = { name, kills: 0, deaths: 0 };
        }
    }

    removePlayer(id: string) {
        this.ships = this.ships.filter((ship) => ship.id !== id);
        this.destroyedShips = this.destroyedShips.filter((ship) => ship.id !== id);
        delete this.statistics.leaderboard[id];
    }

    setPlayerInputs(id: string, inputs: string[]) {
        this.ships.forEach((ship) => {
            if (ship.id === id) {
                ship.inputs = inputs;
                return;
            }
        });
    }

    update(dt: number) {
        ShipManager.moveShips(dt, this.ships, this.projectiles);

        ProjectilesManger.moveProjectiles(dt, this.projectiles);

        AlienManager.moveAliens(dt, this.aliens, this.ships, this.projectiles);

        AsteroidManager.moveAsteroids(dt, this.asteroids);

        CollisionManager.checkCollisions(
            [...this.ships, ...this.aliens, ...this.asteroids, ...this.projectiles],
            this.statistics.leaderboard,
        );

        this.checkDestruction();

        this.slowLoopProgress += dt;
        if (this.slowLoopProgress >= this.slowLoopThreshold) {
            AlienManager.spawnAliens(this.aliens, this.map);

            AsteroidManager.spawnAsteroids({
                dt: this.slowLoopThreshold,
                asteroids: this.asteroids,
                spawns: this.asteroidSpawns,
                map: this.map,
            });

            CollisionManager.checkRadiation(
                [...this.ships, ...this.asteroids],
                this.map,
                this.statistics.leaderboard,
            );

            ShipManager.regenerateShields(this.ships);

            this.checkRespawn(this.slowLoopThreshold);

            this.slowLoopProgress = 0;
        }
    }

    private checkDestruction() {
        this.aliens = this.aliens.filter((alien) => alien.hp > 0);

        this.asteroids = this.asteroids.filter((asteroid) => asteroid.hp > 0);

        this.projectiles = this.projectiles.filter(
            (projectile) => projectile.traveled < projectile.travelLimit,
        );

        const destroyedIndexes: number[] = [];
        for (let i = 0; i < this.ships.length; i++) {
            const ship = this.ships[i];
            if (ship.hp > 0) {
                continue;
            }

            ship.vx = 0;
            ship.vy = 0;
            ship.tRot = 0;
            ship.respawnProgress = 0;
            ship.inputs = [];

            destroyedIndexes.push(i);
            this.destroyedShips.push(ship);
        }
        this.ships = this.ships.filter((_, i) => !destroyedIndexes.includes(i));
    }

    private checkRespawn(dt: number) {
        const respawnedIndexes: number[] = [];
        for (let i = 0; i < this.destroyedShips.length; i++) {
            const ship = this.destroyedShips[i];

            if (ship.respawnProgress >= gameConfig.playerRespawnThreshold) {
                ship.respawnProgress = 0;

                const resource = GAME_SHIPS[ship.resourceGuid];
                ship.hp = resource.health;
                ship.sp = resource.shield;

                const { x, y } = ShipManager.getSpawnLocation(this.map);
                ship.x = x;
                ship.y = y;

                respawnedIndexes.push(i);
                this.ships.push(ship);
            } else {
                ship.respawnProgress += dt;
            }
        }
        this.destroyedShips = this.destroyedShips.filter((_, i) => !respawnedIndexes.includes(i));
    }

    getState() {
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
            aliens: this.aliens.map((alien) => ({
                id: alien.id,
                resourceGuid: alien.resourceGuid,
                name: alien.name,
                hp: alien.hp,
                sp: alien.sp,
                x: alien.x,
                y: alien.y,
                rot: alien.rot,
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

        return state;
    }

    getStatistics() {
        return this.statistics;
    }
}
