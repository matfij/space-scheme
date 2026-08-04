import { GAME_PROJECTILES, ProjectileEntity, ProjectileId } from "@space/shared";

import { genId } from "../utils";

export class ProjectilesManger {
    static createProjectile(params: {
        shooterId: string;
        projectileId: ProjectileId;
        x: number;
        y: number;
        rot: number;
    }): ProjectileEntity {
        const resource = GAME_PROJECTILES[params.projectileId];
        return {
            id: genId(),
            type: "Projectile",
            shooterId: params.shooterId,
            resourceId: params.projectileId,
            radius: resource.radius,
            traveled: 0,
            travelLimit: resource.range,
            x: params.x,
            y: params.y,
            vx: Math.cos(params.rot) * resource.speed,
            vy: Math.sin(params.rot) * resource.speed,
        };
    }

    static moveProjectiles(dt: number, projectiles: ProjectileEntity[]) {
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const p = projectiles[i];
            p.x += dt * p.vx;
            p.y += dt * p.vy;
            p.traveled += Math.hypot(dt * p.vx, dt * p.vy);

            if (p.traveled >= p.travelLimit) {
                projectiles[i] = projectiles[projectiles.length - 1];
                projectiles.pop();
            }
        }
    }
}
