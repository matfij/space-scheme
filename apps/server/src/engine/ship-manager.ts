import {
    GAME_SHIPS,
    GameMap,
    getRandomElement,
    ProjectileEntity,
    ShipEntity,
    ShipGuid,
} from "@space/shared";

import { randRange } from "../utils";
import { ProjectilesManger } from "./projectiles-manager";

export class ShipManager {
    static createShip(params: {
        id: string;
        name: string;
        shipGuid: ShipGuid;
        map: GameMap;
    }): ShipEntity {
        const resource = GAME_SHIPS[params.shipGuid];
        const { x, y } = this.getSpawnLocation(params.map);

        return {
            id: params.id,
            type: "Ship",
            resourceGuid: params.shipGuid,
            name: params.name,
            hp: resource.health,
            sp: resource.shield,
            radius: resource.radius,
            x,
            y,
            rot: 0,
            tRot: 0,
            vx: 0,
            vy: 0,
            respawnProgress: 0,
            ability: {
                guid: resource.ability.guid,
                timeLeft: 0,
                cooldown: 0,
            },
            inputs: [],
        };
    }

    static moveShips(dt: number, ships: ShipEntity[], projectiles: ProjectileEntity[]) {
        for (const ship of ships) {
            this.moveShip(dt, ship, projectiles);
        }
    }

    static moveShip(dt: number, ship: ShipEntity, projectiles: ProjectileEntity[]) {
        let dx = 0;
        let dy = 0;
        const resource = GAME_SHIPS[ship.resourceGuid];

        ship.ability.timeLeft = Math.max(0, ship.ability.timeLeft - dt);
        ship.ability.cooldown = Math.max(0, ship.ability.cooldown - dt);

        if (ship.inputs.includes("KeyA")) {
            dx--;
        }
        if (ship.inputs.includes("KeyD")) {
            dx++;
        }
        if (ship.inputs.includes("KeyW")) {
            dy--;
        }
        if (ship.inputs.includes("KeyS")) {
            dy++;
        }

        if (ship.inputs.includes("KeyO")) {
            let projectileGuids = resource.projectileGuids;

            if (ship.ability.guid === "laser-barrage" && ship.ability.timeLeft > 0) {
                projectileGuids = [
                    ...resource.projectileGuids,
                    ...resource.projectileGuids,
                    ...resource.projectileGuids,
                ];
            }

            ProjectilesManger.shootProjectiles({
                shooterId: ship.id,
                shooterRadius: resource.radius,
                projectileGuids,
                x: ship.x,
                y: ship.y,
                rot: ship.rot,
                projectiles,
            });
        }

        if (ship.inputs.includes("KeyP")) {
            if (ship.ability.cooldown > 0) {
                return;
            }
            ship.ability.timeLeft = resource.ability.duration;
            ship.ability.cooldown = resource.ability.duration + resource.ability.cooldown;
        }

        if (dx !== 0 || dy !== 0) {
            const length = Math.hypot(dx, dy);
            dx /= length;
            dy /= length;

            ship.vx += dx * dt * resource.acceleration;
            ship.vy += dy * dt * resource.acceleration;
            ship.tRot = Math.atan2(dy, dx);
        }

        const currentSpeed = Math.hypot(ship.vx, ship.vy);
        if (currentSpeed > resource.maxSpeed) {
            const scale = resource.maxSpeed / currentSpeed;
            ship.vx *= scale;
            ship.vy *= scale;
        }

        ship.x += ship.vx * dt;
        ship.y += ship.vy * dt;

        let dRot = ship.tRot - ship.rot;
        dRot = Math.atan2(Math.sin(dRot), Math.cos(dRot));
        const maxDRot = resource.rotationSpeed * dt;
        if (Math.abs(dRot) <= maxDRot) {
            ship.rot = ship.tRot;
        } else {
            ship.rot += Math.sign(dRot) * maxDRot;
        }

        ship.vx *= resource.drag;
        ship.vy *= resource.drag;
    }

    static regenerateShields(ships: ShipEntity[]) {
        for (const ship of ships) {
            const resource = GAME_SHIPS[ship.resourceGuid];
            ship.sp = Math.min(resource.shield, ship.sp + resource.shieldRegeneration);
        }
    }

    static getSpawnLocation(map: GameMap) {
        let x = 0;
        let y = 0;

        switch (getRandomElement(["top", "bottom", "left", "right"] as const)) {
            case "top":
                x = randRange(100, map.width - 100);
                y = 100;
                break;
            case "bottom":
                x = randRange(100, map.width - 100);
                y = map.height - 100;
                break;
            case "left":
                x = 100;
                y = randRange(100, map.height - 100);
                break;
            case "right":
                x = map.width - 100;
                y = randRange(100, map.height - 100);
                break;
        }

        return { x, y };
    }
}
