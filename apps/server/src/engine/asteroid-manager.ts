import {
    AsteroidEntity,
    AsteroidGuid,
    GAME_ASTEROIDS,
    GameMap,
    getRandomElement,
} from "@space/shared";

import { genId, randRange } from "../utils";
import { AsteroidSpawn } from "./types";

export class AsteroidManager {
    private static readonly SPAWN_EDGE_OFFSET = 100;

    static spawnAsteroids(params: {
        dt: number;
        asteroids: AsteroidEntity[];
        spawns: AsteroidSpawn[];
        map: GameMap;
    }) {
        for (const spawn of params.spawns) {
            spawn.progress += params.dt;

            if (spawn.progress < spawn.threshold) {
                continue;
            }

            spawn.progress = 0;

            const resource = GAME_ASTEROIDS[spawn.guid];

            const { x, y } = this.getSpawnLocation(params.map, resource.radius);

            const rot = Math.atan2(
                randRange(0, params.map.height) - y,
                randRange(0, params.map.width) - x,
            );

            params.asteroids.push(
                this.createAsteroid({
                    guid: spawn.guid,
                    x,
                    y,
                    rot,
                }),
            );
        }
    }

    static createAsteroid(params: {
        guid: AsteroidGuid;
        x: number;
        y: number;
        rot: number;
    }): AsteroidEntity {
        const resource = GAME_ASTEROIDS[params.guid];

        const speed = randRange(resource.maxSpeed * 0.5, resource.maxSpeed);

        return {
            id: genId(),
            type: "Asteroid",
            resourceGuid: params.guid,
            hp: resource.health,
            radius: resource.radius,
            x: params.x,
            y: params.y,
            vx: speed * Math.cos(params.rot),
            vy: speed * Math.sin(params.rot),
        };
    }

    static moveAsteroids(dt: number, asteroids: AsteroidEntity[]) {
        for (const asteroid of asteroids) {
            AsteroidManager.moveAsteroid(dt, asteroid);
        }
    }

    static moveAsteroid(dt: number, asteroid: AsteroidEntity) {
        asteroid.x += dt * asteroid.vx;
        asteroid.y += dt * asteroid.vy;
    }

    private static getSpawnLocation(map: GameMap, radius: number) {
        let x = 0;
        let y = 0;
        const offset = radius + this.SPAWN_EDGE_OFFSET;

        switch (getRandomElement(["top", "bottom", "left", "right"] as const)) {
            case "top":
                x = randRange(this.SPAWN_EDGE_OFFSET, map.width - this.SPAWN_EDGE_OFFSET);
                y = -offset;
                break;
            case "bottom":
                x = randRange(this.SPAWN_EDGE_OFFSET, map.width - this.SPAWN_EDGE_OFFSET);
                y = map.height + offset;
                break;
            case "left":
                x = -offset;
                y = randRange(this.SPAWN_EDGE_OFFSET, map.height - this.SPAWN_EDGE_OFFSET);
                break;
            case "right":
                x = map.width + offset;
                y = randRange(this.SPAWN_EDGE_OFFSET, map.height - this.SPAWN_EDGE_OFFSET);
                break;
        }

        return { x, y };
    }
}
