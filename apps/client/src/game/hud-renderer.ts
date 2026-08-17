import { gameColors, type GameStateEntity } from "@space/shared";
import { Graphics, Text, type Container } from "pixi.js";

export class HudRenderer {
    private static readonly BAR_WIDTH = 50;
    private static readonly BAR_HEIGHT = 4;

    static render(
        hud: Container,
        entity: GameStateEntity,
        resource: { radius: number; health?: number; shield?: number },
    ) {
        const verticalOffset = "name" in entity ? resource.radius + 30 : resource.radius + 5;
        hud.position.set(0, verticalOffset);

        if (hud.children.length === 0) {
            if ("hp" in entity && resource.health) {
                hud.addChild(new Graphics(), new Graphics());
            }
            if ("sp" in entity && resource.shield) {
                hud.addChild(new Graphics(), new Graphics());
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

        let graphicIndex = 0;

        if ("hp" in entity && resource.health) {
            const bg = hud.children[graphicIndex++] as Graphics;
            const fill = hud.children[graphicIndex++] as Graphics;
            bg.clear()
                .rect(-this.BAR_WIDTH / 2, 0, this.BAR_WIDTH, this.BAR_HEIGHT)
                .fill(gameColors.healthBarLow);
            fill.clear()
                .rect(
                    -this.BAR_WIDTH / 2,
                    0,
                    this.BAR_WIDTH * (entity.hp / resource.health),
                    this.BAR_HEIGHT,
                )
                .fill(gameColors.healthBarHigh);
        }

        if ("sp" in entity && resource.shield) {
            const bg = hud.children[graphicIndex++] as Graphics;
            const fill = hud.children[graphicIndex++] as Graphics;
            bg.clear()
                .rect(-this.BAR_WIDTH / 2, this.BAR_HEIGHT + 2, this.BAR_WIDTH, this.BAR_HEIGHT)
                .fill(gameColors.shieldBarLow);
            fill.clear()
                .rect(
                    -this.BAR_WIDTH / 2,
                    this.BAR_HEIGHT + 2,
                    this.BAR_WIDTH * (entity.sp / resource.shield),
                    this.BAR_HEIGHT,
                )
                .fill(gameColors.shieldBarHigh);
        }
    }
}
