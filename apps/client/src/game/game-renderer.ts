import {
    GAME_ASTEROIDS,
    GAME_PROJECTILES,
    GAME_SHIPS,
    MILKY_WAY,
    type GameMap,
    type GameResource,
    type GameState,
} from "@space/shared";
import { Application, Container, Graphics, Text } from "pixi.js";

const colors = {
    background: "#000814",
    grid: "#afafaf",
    fontLight: "#fafafa",
    healthBarLow: "#333333",
    healthBarHigh: "#e63946",
    shieldBarLow: "#333333",
    shieldBarHigh: "#469cd2",
};

export class GameRenderer {
    private isInitialized = false;
    private isDestroyed = false;

    private readonly app = new Application();
    private readonly map = new Container();
    private readonly grid = new Graphics();

    async initialize(container: HTMLElement) {
        await this.app.init({
            background: colors.background,
            antialias: true,
        });

        container.appendChild(this.app.canvas);
        this.app.stage.addChild(this.map);

        this.map.addChild(this.grid);
        this.renderGrid(MILKY_WAY);

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
        this.map.addChild(this.grid);

        for (const ship of state.ships) {
            const resource = GAME_SHIPS[ship.resourceId];

            const shipGraphic = this.renderSprite(resource.sprite);
            shipGraphic.position.set(ship.x, ship.y);
            shipGraphic.rotation = ship.rot;

            this.map.addChild(this.renderHud(ship, resource));

            this.map.addChild(shipGraphic);

            if (ship.id === "new-player") {
                this.map.position.set(
                    Math.round(this.app.screen.width / 2 - ship.x),
                    Math.round(this.app.screen.height / 2 - ship.y),
                );
            }
        }

        for (const asteroid of state.asteroids) {
            const resource = GAME_ASTEROIDS[asteroid.resourceId];

            const asteroidGraphic = this.renderSprite(resource.sprite);
            asteroidGraphic.position.set(asteroid.x, asteroid.y);

            this.map.addChild(this.renderHud(asteroid, resource));

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

    private renderHud(
        entity: { x: number; y: number; hp?: number; sp?: number; name?: string },
        resource: { radius: number; health?: number; shield?: number },
    ) {
        const hud = new Container();
        hud.position.set(entity.x, entity.y - resource.radius + 50);

        const barWidth = 50;
        const barHeight = 4;

        if (entity.hp && resource.health) {
            hud.addChild(
                new Graphics()
                    .rect(-barWidth / 2, 0, barWidth, barHeight)
                    .fill(colors.healthBarLow)
                    .rect(-barWidth / 2, 0, barWidth * (entity.hp / resource.health), barHeight)
                    .fill(colors.healthBarHigh),
            );
        }
        if (entity.sp && resource.shield) {
            hud.addChild(
                new Graphics()
                    .rect(-barWidth / 2, barHeight + 2, barWidth, barHeight)
                    .fill(colors.shieldBarLow)
                    .rect(
                        -barWidth / 2,
                        barHeight + 2,
                        barWidth * (entity.sp / resource.shield),
                        barHeight,
                    )
                    .fill(colors.shieldBarHigh),
            );
        }

        if (entity.name) {
            const name = new Text({
                text: entity.name + ` ${Math.floor(entity.x)}, ${Math.floor(entity.y)}`,
                style: { fill: colors.fontLight, fontSize: 12 },
            });
            name.anchor.set(0.5, 1);
            name.position.set(0, -4);
            hud.addChild(name);
        }

        return hud;
    }

    private renderGrid(map: GameMap) {
        this.grid.clear();
        for (let x = 0; x <= map.width; x += map.gridSize) {
            this.grid.moveTo(x, -map.height).lineTo(x, 2 * map.height);
        }
        for (let y = 0; y <= map.height; y += map.gridSize) {
            this.grid.moveTo(-map.width, y).lineTo(2 * map.width, y);
        }
        this.grid.stroke({ color: colors.grid, width: 1 });
    }

    destroy() {
        this.isDestroyed = true;
        if (this.isInitialized) {
            this.app.canvas.remove();
            this.app.destroy();
        }
    }
}
