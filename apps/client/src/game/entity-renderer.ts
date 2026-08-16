import {
    GAME_RESOURCES,
    gameColors,
    type GameResource,
    type GameState,
    type ResourceGuid,
} from "@space/shared";
import { Container, Graphics, Text } from "pixi.js";

export class EntityRenderer {
    public static render(
        entity: GameState["ships" | "asteroids" | "projectiles"][number],
        huds?: Map<string, Container>,
    ) {
        const resource = GAME_RESOURCES[entity.resourceGuid];
        const container = new Container();

        const graphic = this.renderSprite(resource.sprite);
        container.addChild(graphic);

        if (huds) {
            const hud = new Container();
            this.buildHud(hud, entity, resource);
            container.addChild(hud);
            huds.set(entity.id, hud);
        }

        return container;
    }

    private static renderSprite(sprite: GameResource<ResourceGuid>["sprite"]) {
        switch (sprite.type) {
            case "Circle":
                return new Graphics().circle(0, 0, sprite.radius).fill(sprite.color);
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

    static buildHud(
        hud: Container,
        entity: GameState["ships" | "asteroids" | "projectiles"][number],
        resource: { radius: number; health?: number; shield?: number },
    ) {
        hud.removeChildren();

        const verticalOffset = "name" in entity ? resource.radius + 30 : resource.radius + 5;
        hud.position.set(0, verticalOffset);

        const barWidth = 50;
        const barHeight = 4;

        if ("hp" in entity && resource.health) {
            const healthBg = new Graphics()
                .rect(-barWidth / 2, 0, barWidth, barHeight)
                .fill(gameColors.healthBarLow);
            const healthFill = new Graphics()
                .rect(-barWidth / 2, 0, barWidth * (entity.hp / resource.health), barHeight)
                .fill(gameColors.healthBarHigh);
            hud.addChild(healthBg, healthFill);
        }

        if ("sp" in entity && resource.shield) {
            const shieldBg = new Graphics()
                .rect(-barWidth / 2, barHeight + 2, barWidth, barHeight)
                .fill(gameColors.shieldBarLow);
            const shieldFill = new Graphics()
                .rect(
                    -barWidth / 2,
                    barHeight + 2,
                    barWidth * (entity.sp / resource.shield),
                    barHeight,
                )
                .fill(gameColors.shieldBarHigh);
            hud.addChild(shieldBg, shieldFill);
        }

        if ("name" in entity) {
            const name = new Text({
                text: entity.name,
                style: { fill: gameColors.fontLight, fontSize: 12 },
            });
            name.anchor.set(0.5, 1);
            name.position.set(0, -4);
            hud.addChild(name);
        }
    }
}
