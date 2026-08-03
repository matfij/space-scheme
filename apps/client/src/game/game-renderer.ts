import { GAME_ASTEROIDS, GAME_SHIPS, type GameState } from "@space/shared";
import { Application, Container, Graphics } from "pixi.js";

import type { GameResource } from "../../../../packages/shared/src/resources/types";

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

        console.log(state.ships.length);

        for (const ship of state.ships) {
            const resource = GAME_SHIPS[ship.resourceId];

            const shipGraphic = this.renderSprite(resource.sprite);
            shipGraphic.position.set(ship.x, ship.y);
            shipGraphic.rotation = ship.rot;

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

    destroy() {
        this.isDestroyed = true;
        if (this.isInitialized) {
            this.app.canvas.remove();
            this.app.destroy();
        }
    }
}
