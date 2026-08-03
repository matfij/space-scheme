import { EntityKind, GameEntity } from "@space/shared";

import { SpatialGrid } from "./spatial-grid";

export class CollisionManager {
    static checkCollisions(entities: GameEntity[]) {
        const grid = new SpatialGrid();
        entities.forEach((entity) => grid.insert(entity));
        const checked = new Set<string>();

        for (const a of entities) {
            for (const b of grid.nearby(a)) {
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
