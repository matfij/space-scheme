import {
    GAME_RESOURCES,
    gameColors,
    gameConfig,
    type GameMap,
    type GameState,
    type GameStateEntity,
} from "@space/shared";
import { Application, Container, Graphics, Sprite } from "pixi.js";

import { useGameStore } from "../common/game-store";
import { BackgroundRenderer } from "./background-renderer";
import { EntityRenderer } from "./entity-renderer";
import { HudRenderer } from "./hud-renderer";

export class GameRenderer {
    private readonly CAMERA_SMOOTHING = 0.12;

    private playerId = useGameStore.getState().playerId;

    private isInitialized = false;
    private isDestroyed = false;
    private cameraInitialized = false;

    private app = new Application();
    private mapLayer = new Container();

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
            background: gameColors.background,
            antialias: true,
        });

        container.appendChild(this.app.canvas);
        this.app.stage.addChild(this.mapLayer);

        await BackgroundRenderer.renderBackground(this.background, map);
        this.mapLayer.addChild(this.background);

        BackgroundRenderer.renderGrid(this.grid, map);
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

        this.syncEntities(state.ships, this.shipGraphics, (ship) =>
            EntityRenderer.render(ship, this.huds),
        );

        this.syncEntities(state.asteroids, this.asteroidGraphics, (asteroid) =>
            EntityRenderer.render(asteroid, this.huds),
        );

        this.syncEntities(state.projectiles, this.projectileGraphics, (projectile) =>
            EntityRenderer.render(projectile),
        );

        this.moveCamera(state.ships);
    }

    private syncEntities(
        entities: GameStateEntity[],
        map: Map<string, Container>,
        factory: (entity: GameStateEntity) => Container,
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

            if ("rot" in entity) {
                graphic.children[0].rotation = entity.rot; // sprite is child 0, hud is 1
            }

            if ("name" in entity || "hp" in entity || "sp" in entity) {
                const hud = this.huds.get(entity.id);
                if (hud) {
                    const resource = GAME_RESOURCES[entity.resourceGuid];
                    HudRenderer.render(hud, entity, resource);
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

    private moveCamera(ships: GameState["ships"]) {
        const playerShip = ships.find((ship) => ship.id === this.playerId);
        if (!playerShip) {
            this.mapLayer.position.set(this.cameraX, this.cameraY);
            return;
        }

        const target = {
            x: this.app.screen.width / 2 - playerShip.x,
            y: this.app.screen.height / 2 - playerShip.y,
        };

        if (!this.cameraInitialized) {
            this.cameraX = target.x;
            this.cameraY = target.y;
            this.cameraInitialized = true;
        } else {
            const factor = 1 - Math.pow(1 - this.CAMERA_SMOOTHING, gameConfig.dt * 60);
            this.cameraX += (target.x - this.cameraX) * factor;
            this.cameraY += (target.y - this.cameraY) * factor;
        }

        this.mapLayer.position.set(this.cameraX, this.cameraY);
    }

    destroy() {
        this.isDestroyed = true;
        if (this.isInitialized) {
            this.app.canvas.remove();
            this.app.destroy();
        }
    }
}
