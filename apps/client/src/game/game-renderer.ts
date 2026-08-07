import {
    GAME_RESOURCES,
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
    private readonly CAMERA_SMOOTHING = 0.12;

    private isInitialized = false;
    private isDestroyed = false;

    private app = new Application();
    private mapLayer = new Container();

    private grid = new Graphics();

    private huds = new Map<string, Container>();
    private shipGraphics = new Map<string, Container>();
    private asteroidGraphics = new Map<string, Container>();
    private projectileGraphics = new Map<string, Container>();

    private cameraX = 0;
    private cameraY = 0;

    async initialize(container: HTMLElement) {
        await this.app.init({
            background: colors.background,
            antialias: true,
        });

        container.appendChild(this.app.canvas);
        this.app.stage.addChild(this.mapLayer);

        this.renderGrid(MILKY_WAY);
        this.mapLayer.addChild(this.grid);

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

        const playerShip = state.ships.find((ship) => ship.id === "new-player");
        if (playerShip) {
            const targetX = this.app.screen.width / 2 - playerShip.x;
            const targetY = this.app.screen.height / 2 - playerShip.y;
            this.cameraX += (targetX - this.cameraX) * this.CAMERA_SMOOTHING;
            this.cameraY += (targetY - this.cameraY) * this.CAMERA_SMOOTHING;
        }
        this.mapLayer.position.set(this.cameraX, this.cameraY);

        this.grid.position.set(
            Math.round(this.cameraX) - this.cameraX,
            Math.round(this.cameraY) - this.cameraY,
        );

        this.syncEntities(state.ships, this.shipGraphics, (ship) => this.renderEntity(ship));

        this.syncEntities(state.asteroids, this.asteroidGraphics, (asteroid) =>
            this.renderEntity(asteroid),
        );

        this.syncEntities(state.projectiles, this.projectileGraphics, (projectile) =>
            this.renderEntity(projectile, true),
        );
    }

    private syncEntities(
        entities: GameState["ships" | "asteroids" | "projectiles"],
        map: Map<string, Container>,
        factory: (entity: GameState["ships" | "asteroids" | "projectiles"][number]) => Container,
    ) {
        const seen = new Set<string>();

        for (const entity of entities) {
            seen.add(entity.id);
            let graphic = map.get(entity.id);

            if (!graphic) {
                graphic = factory(entity);
                map.set(entity.id, graphic);
                this.mapLayer.addChild(graphic);
            }

            graphic.position.set(entity.x, entity.y);

            if ("rot" in entity && graphic.children.length > 0) {
                graphic.children[0].rotation = entity.rot; // sprite is child 0, hud is 1
            }

            if ("name" in entity || "hp" in entity || "sp" in entity) {
                const hud = this.huds.get(entity.id);
                if (hud) {
                    const resource = GAME_RESOURCES[entity.resourceId];
                    this.populateHud(hud, entity, resource);
                }
            }
        }

        for (const [id, graphic] of map) {
            if (!seen.has(id)) {
                map.delete(id);
                this.huds.delete(id);
                this.mapLayer.removeChild(graphic);
                graphic.destroy({ children: true });
            }
        }
    }

    private renderEntity(
        entity: GameState["ships" | "asteroids" | "projectiles"][number],
        skipHud?: boolean,
    ) {
        const resource = GAME_RESOURCES[entity.resourceId];
        const container = new Container();

        const graphic = this.renderSprite(resource.sprite);
        container.addChild(graphic);

        if (!skipHud) {
            const hud = new Container();
            this.populateHud(hud, entity, resource);
            container.addChild(hud);
            this.huds.set(entity.id, hud);
        }

        return container;
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

    private populateHud(
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
                .fill(colors.healthBarLow);
            const healthFill = new Graphics()
                .rect(-barWidth / 2, 0, barWidth * (entity.hp / resource.health), barHeight)
                .fill(colors.healthBarHigh);
            hud.addChild(healthBg, healthFill);
        }

        if ("sp" in entity && resource.shield) {
            const shieldBg = new Graphics()
                .rect(-barWidth / 2, barHeight + 2, barWidth, barHeight)
                .fill(colors.shieldBarLow);
            const shieldFill = new Graphics()
                .rect(
                    -barWidth / 2,
                    barHeight + 2,
                    barWidth * (entity.sp / resource.shield),
                    barHeight,
                )
                .fill(colors.shieldBarHigh);
            hud.addChild(shieldBg, shieldFill);
        }

        if ("name" in entity) {
            const name = new Text({
                text: entity.name + ` ${Math.floor(entity.x)}, ${Math.floor(entity.y)}`,
                style: { fill: colors.fontLight, fontSize: 12 },
            });
            name.anchor.set(0.5, 1);
            name.position.set(0, -4);
            hud.addChild(name);
        }
    }

    private renderGrid(map: GameMap) {
        this.grid.clear();
        for (let x = 0; x <= map.width; x += map.gridSize) {
            this.grid.moveTo(x + 0.5, -map.height).lineTo(x + 0.5, 2 * map.height);
        }
        for (let y = 0; y <= map.height; y += map.gridSize) {
            this.grid.moveTo(-map.width, y + 0.5).lineTo(2 * map.width, y + 0.5);
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
