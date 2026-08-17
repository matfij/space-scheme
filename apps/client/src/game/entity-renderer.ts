import {
    GAME_RESOURCES,
    type GameResource,
    type GameStateEntity,
    type ResourceGuid,
} from "@space/shared";
import { Container, Graphics } from "pixi.js";

import { HudRenderer } from "./hud-renderer";

export class EntityRenderer {
    private static readonly ASTEROID = {
        POINTS_TO_INTERPOLATE: 16,
        JAGGEDNESS: 0.1,
    };

    public static render(entity: GameStateEntity, huds?: Map<string, Container>) {
        const resource = GAME_RESOURCES[entity.resourceGuid];
        const container = new Container();

        const graphic = this.renderSprite(resource.sprite);
        container.addChild(graphic);

        if (huds) {
            const hud = new Container();
            HudRenderer.render(hud, entity, resource);
            container.addChild(hud);
            huds.set(entity.id, hud);
        }

        return container;
    }

    private static renderSprite(sprite: GameResource<ResourceGuid>["sprite"]) {
        switch (sprite.type) {
            case "Circle":
                if (sprite.isAsteroid) {
                    return this.renderAsteroidSprite(sprite);
                } else {
                    const graphic = new Graphics().circle(0, 0, sprite.radius).fill(sprite.color);
                    return graphic;
                }
            case "Polygon":
                const graphic = new Graphics().moveTo(
                    sprite.coordinates[0][0],
                    sprite.coordinates[0][1],
                );
                for (let i = 1; i < sprite.coordinates.length; i++) {
                    graphic.lineTo(sprite.coordinates[i][0], sprite.coordinates[i][1]);
                }
                graphic.closePath().stroke({ color: sprite.color, width: sprite.width });
                return graphic;
        }
    }

    private static renderAsteroidSprite(sprite: { color: string; radius: number; width: number }) {
        const graphic = new Graphics();

        // circular interpolation
        const vertices: { x: number; y: number }[] = [];
        for (let i = 0; i < this.ASTEROID.POINTS_TO_INTERPOLATE; i++) {
            const angle = (i / this.ASTEROID.POINTS_TO_INTERPOLATE) * Math.PI * 2;
            const r =
                sprite.radius *
                (1 - this.ASTEROID.JAGGEDNESS / 2 + Math.random() * this.ASTEROID.JAGGEDNESS);
            vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
        }

        graphic.poly(vertices).fill(sprite.color);
        graphic.poly(vertices).stroke({ color: "rgba(141, 81, 81, 0.3)", width: sprite.width });

        // craters
        for (let i = 0; i < Math.floor(sprite.radius / 12); i++) {
            const cx = (Math.random() - 0.5) * sprite.radius * 1.1;
            const cy = (Math.random() - 0.5) * sprite.radius * 1.1;
            const cr = sprite.radius * (0.08 + Math.random() * 0.12);
            graphic.circle(cx, cy, cr).fill("rgba(60, 37, 37, 0.15)");
            graphic
                .circle(cx, cy, cr)
                .stroke({ color: "rgba(20, 10, 10, 0.2)", width: sprite.width });
        }

        // cracks
        for (let i = 0; i < Math.floor(sprite.radius / 12); i++) {
            const x = (Math.random() - 0.5) * sprite.radius * 1.2;
            const y = (Math.random() - 0.5) * sprite.radius * 1.2;
            graphic.moveTo(x, y);
            graphic.lineTo(x + sprite.radius / 5, y + sprite.radius / 5);
            graphic.stroke({ color: "rgba(60, 37, 37, 0.18)", width: sprite.width });
        }

        return graphic;
    }
}
