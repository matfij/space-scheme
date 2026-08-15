import {
    GAME_RESOURCES,
    type GameMap,
    type GameResource,
    type GameState,
    type ResourceGuid,
} from "@space/shared";
import { Application, Assets, Container, Graphics, Sprite, Text } from "pixi.js";

import { useGameStore } from "../common/game-store";

const colors = {
    background: "#860f0f",
    grid: "rgb(53, 47, 47)",
    fontLight: "#fafafa",
    healthBarLow: "#333333",
    healthBarHigh: "#e63946",
    shieldBarLow: "#333333",
    shieldBarHigh: "#469cd2",
};

type Snapshot = {
    state: GameState;
    time: number;
};

export class GameRenderer {
    private interpolationDelay = 200;
    private readonly CAMERA_SMOOTHING = 0.12;

    private playerId = useGameStore.getState().playerId;

    private isInitialized = false;
    private isDestroyed = false;

    private app = new Application();
    private mapLayer = new Container();

    private snapshots: Snapshot[] = [];

    private grid = new Graphics();
    private background = new Sprite();

    private huds = new Map<string, Container>();
    private shipGraphics = new Map<string, Container>();
    private asteroidGraphics = new Map<string, Container>();
    private projectileGraphics = new Map<string, Container>();

    private cameraX = 0;
    private cameraY = 0;

    async initialize(container: HTMLElement, map: GameMap) {
        await this.app.init({
            background: colors.background,
            antialias: true,
        });

        container.appendChild(this.app.canvas);
        this.app.stage.addChild(this.mapLayer);

        await this.renderBackground(map);
        this.mapLayer.addChild(this.background);

        this.renderGrid(map);
        this.mapLayer.addChild(this.grid);

        this.app.resizeTo = container;
        this.app.resize();

        if (this.isDestroyed) {
            this.app.destroy({ removeView: true });
            return;
        }

        this.app.ticker.add(this.renderFrame);

        this.isInitialized = true;
    }

    syncState(state: GameState) {
        if (!this.isInitialized || this.isDestroyed) {
            return;
        }

        this.snapshots.push({
            state,
            time: performance.now(),
        });

        if (this.snapshots.length > 5) {
            this.snapshots.shift();
        }
    }

    private renderFrame = () => {
        if (this.snapshots.length < 2) {
            return;
        }

        const renderTime = performance.now() - this.interpolationDelay;

        let previous = this.snapshots[0];
        let current = this.snapshots[1];

        for (let i = 1; i < this.snapshots.length; i++) {
            if (this.snapshots[i].time >= renderTime) {
                current = this.snapshots[i];
                previous = this.snapshots[i - 1];
                break;
            }
        }

        const duration = current.time - previous.time;

        const t = duration > 0 ? (renderTime - previous.time) / duration : 1;

        this.renderInterpolated(previous.state, current.state, Math.max(0, Math.min(1, t)));
    };

    private renderInterpolated(previous: GameState, current: GameState, t: number) {
        const ships = current.ships.map((currentShip) => {
            const previousShip = previous.ships.find((ship) => ship.id === currentShip.id);
            if (!previousShip) {
                return currentShip;
            }
            return {
                ...currentShip,
                x: this.lerp(previousShip.x, currentShip.x, t),
                y: this.lerp(previousShip.y, currentShip.y, t),
                rot: this.lerpAngle(previousShip.rot, currentShip.rot, t),
            };
        });

        const asteroids = current.asteroids.map((currAsteroid) => {
            const prevAsteroid = previous.asteroids.find(
                (asteroid) => asteroid.id === currAsteroid.id,
            );
            if (!prevAsteroid) {
                return currAsteroid;
            }
            return {
                ...currAsteroid,
                x: this.lerp(prevAsteroid.x, currAsteroid.x, t),
                y: this.lerp(prevAsteroid.y, currAsteroid.y, t),
            };
        });

        const projectiles = current.projectiles.map((currentShip) => {
            const previousShip = previous.projectiles.find(
                (projectile) => projectile.id === currentShip.id,
            );
            if (!previousShip) {
                return currentShip;
            }
            return {
                ...currentShip,
                x: this.lerp(previousShip.x, currentShip.x, t),
                y: this.lerp(previousShip.y, currentShip.y, t),
                rot: this.lerpAngle(previousShip.rot, currentShip.rot, t),
            };
        });

        const playerShip = ships.find((ship) => ship.id === this.playerId);
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

        this.syncEntities(ships, this.shipGraphics, (ship) => this.renderEntity(ship));

        this.syncEntities(asteroids, this.asteroidGraphics, (asteroid) =>
            this.renderEntity(asteroid),
        );

        this.syncEntities(projectiles, this.projectileGraphics, (projectile) =>
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
                    const resource = GAME_RESOURCES[entity.resourceGuid];
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
        const resource = GAME_RESOURCES[entity.resourceGuid];
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

    private renderSprite(sprite: GameResource<ResourceGuid>["sprite"]) {
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
        for (let x = -map.width; x <= 2 * map.width; x += map.gridSize) {
            this.grid.moveTo(x + 0.5, -map.height).lineTo(x + 0.5, 2 * map.height);
        }
        for (let y = -map.height; y <= 2 * map.height; y += map.gridSize) {
            this.grid.moveTo(-map.width, y + 0.5).lineTo(2 * map.width, y + 0.5);
        }
        this.grid.stroke({ color: colors.grid, width: 1 });
    }

    private async renderBackground(map: GameMap) {
        const texture = await Assets.load(map.imageUri);
        this.background.texture = texture;
        this.background.width = map.width;
        this.background.height = map.height;
        this.background.tint = 0x777777;
    }

    private lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
    }

    private lerpAngle(a: number, b: number, t: number) {
        const twoPi = Math.PI * 2;

        let delta = (b - a) % twoPi;

        if (delta > Math.PI) {
            delta -= twoPi;
        } else if (delta < -Math.PI) {
            delta += twoPi;
        }

        return a + delta * t;
    }

    destroy() {
        this.isDestroyed = true;
        if (this.isInitialized) {
            this.app.canvas.remove();
            this.app.destroy();
        }
    }
}
