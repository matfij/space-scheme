import { GAME_PROJECTILES, ProjectileEntity, ProjectileGuid } from "@space/shared";

import { genId } from "../utils";

export class ProjectilesManger {
    static shootProjectiles(params: {
        shooterId: string;
        shooterRadius: number;
        projectileGuids: ProjectileGuid[];
        x: number;
        y: number;
        rot: number;
        projectiles: ProjectileEntity[];
    }) {
        const count = params.projectileGuids.length;
        const offsetX = -Math.sin(params.rot);
        const offsetY = Math.cos(params.rot);
        const spacing = params.shooterRadius / count;
        const totalWidth = spacing * (count - 1);

        const dirX = Math.cos(params.rot);
        const dirY = Math.sin(params.rot);
        const spawnDist = params.shooterRadius + 1;

        params.projectileGuids.forEach((projectile, i) => {
            const offset = i * spacing - totalWidth / 2;

            params.projectiles.push(
                this.createProjectile({
                    shooterId: params.shooterId,
                    projectileGuid: projectile,
                    x: params.x + offsetX * offset + dirX * spawnDist,
                    y: params.y + offsetY * offset + dirY * spawnDist,
                    rot: params.rot,
                }),
            );
        });
    }

    static createProjectile(params: {
        shooterId: string;
        projectileGuid: ProjectileGuid;
        x: number;
        y: number;
        rot: number;
    }): ProjectileEntity {
        const resource = GAME_PROJECTILES[params.projectileGuid];
        return {
            id: genId(),
            type: "Projectile",
            shooterId: params.shooterId,
            resourceGuid: params.projectileGuid,
            radius: resource.radius,
            traveled: 0,
            travelLimit: resource.range,
            x: params.x,
            y: params.y,
            vx: Math.cos(params.rot) * resource.speed,
            vy: Math.sin(params.rot) * resource.speed,
            rot: params.rot,
        };
    }

    static moveProjectiles(dt: number, projectiles: ProjectileEntity[]) {
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const p = projectiles[i];
            p.x += dt * p.vx;
            p.y += dt * p.vy;
            p.traveled += Math.hypot(dt * p.vx, dt * p.vy);
        }
    }
}
