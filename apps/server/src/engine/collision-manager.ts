import {
    AsteroidEntity,
    EntityKind,
    GAME_ASTEROIDS,
    GAME_PROJECTILES,
    GAME_RESOURCES,
    GAME_SHIPS,
    GameEntity,
    GameMap,
    GameStatistics,
    ProjectileEntity,
    ShipEntity,
} from "@space/shared";

import { SpatialGrid } from "./spatial-grid";

export class CollisionManager {
    private static readonly RESTITUTION = 0.8;
    private static readonly ASTEROID_TO_SHIP_DMG_FACTOR = 0.02;
    private static readonly SHIP_TO_SHIP_DMG_FACTOR = 0.06;
    private static readonly SHIP_TO_ASTEROID_DMG_FACTOR = 0.08;

    private static readonly RADIATION_DAMAGE_FACTOR = 0.1;

    static checkCollisions(entities: GameEntity[], leaderboard: GameStatistics["leaderboard"]) {
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
                    this.resolveCollision(a, b, leaderboard);
                }
            }
        }
    }

    static resolveCollision(
        a: GameEntity,
        b: GameEntity,
        leaderboard: GameStatistics["leaderboard"],
    ) {
        if (("hp" in a && a.hp <= 0) || ("hp" in b && b.hp <= 0)) {
            return;
        }

        const key = [a.type, b.type].sort().join("-") as `${EntityKind}-${EntityKind}`;

        const aRes = GAME_RESOURCES[a.resourceGuid];
        const bRes = GAME_RESOURCES[b.resourceGuid];

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
                const astRes1 = GAME_ASTEROIDS[ast1.resourceGuid];
                const ast2 = b as AsteroidEntity;
                const astRes2 = GAME_ASTEROIDS[ast2.resourceGuid];

                ast1.hp -= impactSpeed * astRes2.mass;
                ast2.hp -= impactSpeed * astRes1.mass;

                break;
            }
            case "Asteroid-Ship": {
                const shp = (a.type === "Ship" ? a : b) as ShipEntity;
                const shpRes = GAME_SHIPS[shp.resourceGuid];
                const ast = (a.type === "Asteroid" ? a : b) as AsteroidEntity;
                const astRes = GAME_ASTEROIDS[ast.resourceGuid];

                this.applyDamageWithShield(
                    shp,
                    this.ASTEROID_TO_SHIP_DMG_FACTOR * impactSpeed * astRes.mass,
                );

                ast.hp -= this.SHIP_TO_ASTEROID_DMG_FACTOR * impactSpeed * shpRes.mass;

                if (shp.hp <= 0) {
                    leaderboard[shp.id].deaths++;
                }

                break;
            }
            case "Asteroid-Projectile": {
                const ast = (a.type === "Asteroid" ? a : b) as AsteroidEntity;
                const prj = (a.type === "Projectile" ? a : b) as ProjectileEntity;
                const prjRes = GAME_PROJECTILES[prj.resourceGuid];

                ast.hp -= prjRes.damage;
                prj.traveled = prj.travelLimit;

                break;
            }
            case "Ship-Ship": {
                const shp1 = a as ShipEntity;
                const shpRes1 = GAME_SHIPS[shp1.resourceGuid];
                const shp2 = b as ShipEntity;
                const shpRes2 = GAME_SHIPS[shp2.resourceGuid];

                this.applyDamageWithShield(
                    shp1,
                    this.SHIP_TO_SHIP_DMG_FACTOR * impactSpeed * shpRes1.mass,
                );
                this.applyDamageWithShield(
                    shp2,
                    this.SHIP_TO_SHIP_DMG_FACTOR * impactSpeed * shpRes2.mass,
                );

                if (shp1.hp <= 0) {
                    leaderboard[shp2.id].kills++;
                    leaderboard[shp1.id].deaths++;
                }
                if (shp2.hp <= 0) {
                    leaderboard[shp1.id].kills++;
                    leaderboard[shp2.id].deaths++;
                }

                break;
            }
            case "Projectile-Ship": {
                const shp = (a.type === "Ship" ? a : b) as ShipEntity;
                const prj = (a.type === "Projectile" ? a : b) as ProjectileEntity;
                const prjRes = GAME_PROJECTILES[prj.resourceGuid];

                this.applyDamageWithShield(shp, prjRes.damage);
                prj.traveled = prj.travelLimit;

                if (shp.hp <= 0) {
                    leaderboard[prj.shooterId].kills++;
                    leaderboard[shp.id].deaths++;
                }

                break;
            }

            case "Projectile-Projectile": {
                break;
            }
        }
    }

    static checkRadiation(
        entities: GameEntity[],
        map: GameMap,
        leaderboard: GameStatistics["leaderboard"],
    ) {
        for (const entity of entities) {
            const dx = entity.x < 0 ? -entity.x : -map.width + entity.x;
            const dy = entity.y < 0 ? -entity.y : -map.height + entity.y;
            const dxy = Math.hypot(Math.max(0, dx), Math.max(0, dy));

            const damage = this.RADIATION_DAMAGE_FACTOR * dxy;

            if (entity.type === "Asteroid" || entity.type === "Ship") {
                entity.hp -= damage;
            }

            if (entity.type === "Ship" && entity.hp <= 0) {
                leaderboard[entity.id].deaths++;
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
