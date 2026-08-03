import { GAME_SHIPS, ShipEntity } from "@space/shared";

export class ShipManager {
    static createShip(id: string, shipId: string): ShipEntity {
        const resource = GAME_SHIPS[shipId];
        return {
            id,
            type: "Ship",
            resourceId: shipId,
            radius: resource.radius,
            x: 0,
            y: 0,
            rot: 0,
            tRot: 0,
            vx: 0,
            vy: 0,
            inputs: [],
        };
    }

    static moveShip(dt: number, ship: ShipEntity) {
        let dx = 0;
        let dy = 0;
        const resource = GAME_SHIPS[ship.resourceId];

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
            // this.addProjectile(ship.id, ship.x, ship.y, resource.projectTileSpeed, ship.rot);
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
}
