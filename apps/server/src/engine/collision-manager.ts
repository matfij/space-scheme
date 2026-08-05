import {
    AsteroidEntity,
    EntityKind,
    GAME_ASTEROIDS,
    GAME_PROJECTILES,
    GAME_RESOURCES,
    GAME_SHIPS,
    GameEntity,
    ProjectileEntity,
    ShipEntity,
} from "@space/shared";

import { SpatialGrid } from "./spatial-grid";

export class CollisionManager {
    private static readonly RESTITUTION = 0.8;
    private static readonly ASTEROID_TO_SHIP_DMG_FACTOR = 0.02;
    private static readonly SHIP_TO_SHIP_DMG_FACTOR = 0.06;
    private static readonly SHIP_TO_ASTEROID_DMG_FACTOR = 0.08;

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

        const aRes = GAME_RESOURCES[a.resourceId];
        const bRes = GAME_RESOURCES[b.resourceId];

        let nx = b.x - a.x;
        let ny = b.y - a.y;
        const dxy = Math.hypot(nx, ny) || 0.0001;
        nx /= dxy;
        ny /= dxy;

        const overlap = a.radius + b.radius - dxy;

        if (overlap > 0) {
            const totalMass = aRes.mass + bRes.mass;
            a.x -= nx * overlap * (bRes.mass / totalMass);
            a.y -= ny * overlap * (bRes.mass / totalMass);
            b.x += nx * overlap * (aRes.mass / totalMass);
            b.y += ny * overlap * (aRes.mass / totalMass);
        }

        const rvx = b.vx - a.vx;
        const rvy = b.vy - a.vy;
        const vNormal = rvx * nx + rvy * ny;

        if (vNormal < 0) {
            const impactFactor =
                (-(1 + this.RESTITUTION) * vNormal) / (1 / aRes.mass + 1 / bRes.mass);
            const impactX = impactFactor * nx;
            const impactY = impactFactor * ny;

            a.vx -= impactX / aRes.mass;
            a.vy -= impactY / aRes.mass;
            b.vx += impactX / bRes.mass;
            b.vy += impactY / bRes.mass;
        }

        const impactSpeed = Math.max(0, Math.abs(vNormal));

        switch (key) {
            case "Asteroid-Asteroid": {
                const ast1 = a as AsteroidEntity;
                const astRes1 = GAME_ASTEROIDS[ast1.resourceId];
                const ast2 = b as AsteroidEntity;
                const astRes2 = GAME_ASTEROIDS[ast2.resourceId];

                ast1.hp -= impactSpeed * astRes2.mass;
                ast2.hp -= impactSpeed * astRes1.mass;

                break;
            }
            case "Asteroid-Ship": {
                const shp = (a.type === "Ship" ? a : b) as ShipEntity;
                const shpRes = GAME_SHIPS[shp.resourceId];
                const ast = (a.type === "Asteroid" ? a : b) as AsteroidEntity;
                const astRes = GAME_ASTEROIDS[ast.resourceId];

                this.applyDamageWithShield(
                    shp,
                    this.ASTEROID_TO_SHIP_DMG_FACTOR * impactSpeed * astRes.mass,
                );

                ast.hp -= this.SHIP_TO_ASTEROID_DMG_FACTOR * impactSpeed * shpRes.mass;

                break;
            }
            case "Asteroid-Projectile": {
                const ast = (a.type === "Asteroid" ? a : b) as AsteroidEntity;
                const prj = (a.type === "Projectile" ? a : b) as ProjectileEntity;
                const prjRes = GAME_PROJECTILES[prj.resourceId];

                ast.hp -= prjRes.damage;
                prj.traveled = prj.travelLimit;

                break;
            }
            case "Ship-Ship": {
                const shp1 = a as ShipEntity;
                const shpRes1 = GAME_SHIPS[shp1.resourceId];
                const shp2 = b as ShipEntity;
                const shpRes2 = GAME_SHIPS[shp2.resourceId];

                this.applyDamageWithShield(
                    shp1,
                    this.SHIP_TO_SHIP_DMG_FACTOR * impactSpeed * shpRes1.mass,
                );
                this.applyDamageWithShield(
                    shp2,
                    this.SHIP_TO_SHIP_DMG_FACTOR * impactSpeed * shpRes2.mass,
                );

                break;
            }
            case "Ship-Projectile": {
                const shp = (a.type === "Ship" ? a : b) as ShipEntity;
                const prj = (a.type === "Projectile" ? a : b) as ProjectileEntity;
                const prjRes = GAME_PROJECTILES[prj.resourceId];

                this.applyDamageWithShield(shp, prjRes.damage);
                prj.traveled = prj.travelLimit;

                break;
            }

            case "Projectile-Projectile": {
                break;
            }
        }
    }

    private static applyDamageWithShield(shp: ShipEntity, dmg: number) {
        const shieldAbsorb = Math.min(shp.sp, dmg);
        shp.sp = Math.max(0, shp.sp - dmg);
        const leftover = Math.max(0, dmg - shieldAbsorb);
        shp.hp -= leftover;
    }
}
