import { AsteroidEntity, GAME_ASTEROIDS } from "@space/shared";

import { genId, randRange } from "../utils";

export class AsteroidManager {
    static createAsteroid(x: number, y: number): AsteroidEntity {
        const resource = GAME_ASTEROIDS["asteroid-small-ball"];
        return {
            id: genId(),
            type: "Asteroid",
            resourceId: "asteroid-small-ball",
            hp: resource.health,
            radius: resource.radius,
            x,
            y,
            vx: randRange(-resource.maxSpeed, resource.maxSpeed),
            vy: randRange(-resource.maxSpeed, resource.maxSpeed),
        };
    }

    static moveAsteroid(dt: number, asteroid: AsteroidEntity) {
        asteroid.x += dt * asteroid.vx;
        asteroid.y += dt * asteroid.vy;
    }
}
