import {
    GAME_ASTEROIDS,
    GAME_PROJECTILES,
    GAME_SHIPS,
    type GameResource,
    type GameState,
    type ShipResource,
} from "@space/shared";
import { Application, Container, Graphics, Text } from "pixi.js";

export class GameRenderer {
    private isInitialized = false;
    private isDestroyed = false;

    readonly app = new Application();
    readonly map = new Container();

    async initialize(container: HTMLElement) {
        await this.app.init({
            background: "#000814",
            antialias: true,
        });
        container.appendChild(this.app.canvas);
        this.app.stage.addChild(this.map);
        this.app.resizeTo = container;
        this.app.resize();

        if (this.isDestroyed) {
            this.app.destroy({ removeView: true });
            return;
        }

        this.isInitialized = true;
    }

    render(state: GameState) {
        if (!this.isInitialized || this.isDestroyed) {
            return;
        }

        this.map.removeChildren();

        for (const ship of state.ships) {
            const resource = GAME_SHIPS[ship.resourceId];

            const shipGraphic = this.renderSprite(resource.sprite);
            shipGraphic.position.set(ship.x, ship.y);
            shipGraphic.rotation = ship.rot;

            this.map.addChild(this.renderShipHud(ship, resource));

            this.map.addChild(shipGraphic);

            if (ship.id === "new-player") {
                this.map.position.set(
                    this.app.screen.width / 2 - ship.x,
                    this.app.screen.height / 2 - ship.y,
                );
            }
        }

        for (const asteroid of state.asteroids) {
            const resource = GAME_ASTEROIDS[asteroid.resourceId];

            const asteroidGraphic = this.renderSprite(resource.sprite);
            asteroidGraphic.position.set(asteroid.x, asteroid.y);

            this.map.addChild(asteroidGraphic);
        }

        for (const projectile of state.projectiles) {
            const resource = GAME_PROJECTILES[projectile.resourceId];

            const projectileGraphic = this.renderSprite(resource.sprite);
            projectileGraphic.position.set(projectile.x, projectile.y);

            this.map.addChild(projectileGraphic);
        }
    }

    private renderSprite(sprite: GameResource["sprite"]) {
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

    private renderShipHud(ship: GameState["ships"][number], resource: ShipResource) {
        const hud = new Container();
        hud.position.set(ship.x, ship.y - resource.radius + 50);

        const barWidth = 40;
        const barHeight = 4;

        hud.addChild(
            new Graphics()
                .rect(-barWidth / 2, 0, barWidth, barHeight)
                .fill("#333333")
                .rect(-barWidth / 2, 0, barWidth * (ship.hp / resource.health), barHeight)
                .fill("#e63946"),
        );

        hud.addChild(
            new Graphics()
                .rect(-barWidth / 2, barHeight + 2, barWidth, barHeight)
                .fill("#333333")
                .rect(
                    -barWidth / 2,
                    barHeight + 2,
                    barWidth * (ship.sp / resource.shield),
                    barHeight,
                )
                .fill("#457b9d"),
        );

        const name = new Text({ text: ship.name, style: { fill: "#fff", fontSize: 12 } });
        name.anchor.set(0.5, 1);
        name.position.set(0, -4);
        hud.addChild(name);

        return hud;
    }

    destroy() {
        this.isDestroyed = true;
        if (this.isInitialized) {
            this.app.canvas.remove();
            this.app.destroy();
        }
    }
}
