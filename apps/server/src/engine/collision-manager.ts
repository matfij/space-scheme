import { EntityKind, GameEntity } from "@space/shared";

import { SpatialGrid } from "./spatial-grid";

export class CollisionManager {
    static checkCollisions(entities: GameEntity[]) {
        const grid = new SpatialGrid();

        for (const entity of entities) {
            grid.insert(entity);
        }

        for (let i = 0; i < entities.length; i++) {
            const a = entities[i];
            for (const b of grid.nearby(a)) {
                if (a.id >= b.id) {
                    continue;
                }
                const dxy = Math.hypot(a.x - b.x, a.y - b.y);
                if (dxy < a.radius + b.radius) {
                    this.resolveCollision(a, b);
                }
            }
        }
    }

    static resolveCollision(a: GameEntity, b: GameEntity) {
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
}
