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

            const { x, y } = this.getSpawnLocation(params.map);

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

    private static getSpawnLocation(map: GameMap) {
        let x = 0;
        let y = 0;

        switch (getRandomElement(["top", "bottom", "left", "right"] as const)) {
            case "top":
                x = randRange(100, map.width - 100);
                y = -200;
                break;
            case "bottom":
                x = randRange(100, map.width - 100);
                y = map.height + 200;
                break;
            case "left":
                x = -200;
                y = randRange(100, map.height - 100);
                break;
            case "right":
                x = map.width + 200;
                y = randRange(100, map.height - 100);
                break;
        }

        return { x, y };
    }
}
