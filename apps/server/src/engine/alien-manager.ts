import {
    AlienEntity,
    checkChance,
    GAME_ALIENS,
    GameMap,
    genId,
    getRandomElement,
    ProjectileEntity,
    ShipEntity,
} from "@space/shared";

import { randRange } from "../utils";
import { ProjectilesManger } from "./projectiles-manager";

export class AlienManager {
    private static readonly SPAWN_EDGE_OFFSET = 100;

    static spawnAliens(alines: AlienEntity[], map: GameMap) {
        for (const spawn of map.aliens) {
            const existingOfKind = alines.filter((alien) => alien.resourceGuid === spawn.guid);
            if (existingOfKind.length >= spawn.limit) {
                continue;
            }

            const resource = GAME_ALIENS[spawn.guid];
            const location = this.getSpawnLocation(map, resource.radius);
            alines.push({
                id: genId(),
                name: resource.name,
                resourceGuid: resource.guid,
                type: "Alien",
                hp: resource.health,
                sp: resource.shield,
                radius: resource.radius,
                x: location.x,
                y: location.y,
                rot: 0,
                tRot: 0,
                vx: 0,
                vy: 0,
                target: { x: randRange(0, map.width), y: randRange(0, map.height) },
            });
        }
    }

    static moveAliens(
        dt: number,
        aliens: AlienEntity[],
        players: ShipEntity[],
        projectiles: ProjectileEntity[],
    ) {
        for (const alien of aliens) {
            if (players.length > 0) {
                let targetId = alien.target.id;
                let currentTarget = players.find((player) => player.id === targetId);
                const resource = GAME_ALIENS[alien.resourceGuid];

                if (!currentTarget || checkChance(resource.ai.forgetfulness)) {
                    const newTarget = getRandomElement(players);
                    alien.target.id = newTarget.id;
                    alien.target.x = newTarget.x;
                    alien.target.y = newTarget.y;
                } else if (currentTarget && checkChance(resource.ai.calibration)) {
                    alien.target.x = currentTarget.x;
                    alien.target.y = currentTarget.y;
                }
            }

            this.moveAlien(dt, alien, projectiles);
        }
    }

    static moveAlien(dt: number, alien: AlienEntity, projectiles: ProjectileEntity[]) {
        const resource = GAME_ALIENS[alien.resourceGuid];

        let dx = 0;
        let dy = 0;
        let dxRot = 0;
        let dyRot = 0;

        if (alien.x > alien.target.x) {
            dx--;
            dxRot--;
        } else if (alien.x < alien.target.x) {
            dx++;
            dxRot++;
        }
        if (Math.abs(alien.x - alien.target.x) < resource.ai.proximity) {
            dx = -dx;
        }

        if (alien.y > alien.target.y) {
            dy--;
            dyRot--;
        } else if (alien.y < alien.target.y) {
            dy++;
            dyRot++;
        }
        if (Math.abs(alien.y - alien.target.y) < resource.ai.proximity) {
            dy = -dy;
        }

        if (dx !== 0 || dy !== 0) {
            const length = Math.hypot(dx, dy);
            dx /= length;
            dy /= length;

            alien.vx += dx * dt * resource.acceleration;
            alien.vy += dy * dt * resource.acceleration;
            alien.tRot = Math.atan2(dyRot, dxRot);
        }

        const currentSpeed = Math.hypot(alien.vx, alien.vy);
        if (currentSpeed > resource.maxSpeed) {
            const scale = resource.maxSpeed / currentSpeed;
            alien.vx *= scale;
            alien.vy *= scale;
        }

        alien.x += dt * alien.vx;
        alien.y += dt * alien.vy;

        let dRot = alien.tRot - alien.rot;
        dRot = Math.atan2(Math.sin(dRot), Math.cos(dRot));
        const maxDRot = resource.rotationSpeed * dt;
        if (Math.abs(dRot) <= maxDRot) {
            alien.rot = alien.tRot;
        } else {
            alien.rot += Math.sign(dRot) * maxDRot;
        }

        if (checkChance(resource.ai.aggressiveness)) {
            ProjectilesManger.shootProjectiles({
                shooterId: alien.id,
                projectiles,
                projectileGuids: resource.projectileGuids,
                rot: alien.rot,
                x: alien.x,
                y: alien.y,
                shooterRadius: resource.radius,
            });
        }
    }

    static regenerateShields(aliens: AlienEntity[]) {
        for (const alien of aliens) {
            const resource = GAME_ALIENS[alien.resourceGuid];
            alien.sp = Math.min(resource.shield, alien.sp + resource.shieldRegeneration);
        }
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
