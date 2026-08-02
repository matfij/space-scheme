import { GAME_ASTEROIDS, GAME_SHIPS, type GameState, type JoinMessage } from "@space/shared";
import { Application, Container, Graphics } from "pixi.js";

export class GameMangerWs {
    private isInitialized = false;
    private isDestroyed = false;
    private hasClearedInput = false;

    private ws?: WebSocket;
    private keys = new Set<string>();

    readonly app = new Application();
    readonly map = new Container();

    async initialize(container: HTMLElement, url: string) {
        await this.setupCanvas(container);
        if (this.isDestroyed) {
            this.app.destroy({ removeView: true });
            return;
        }
        this.connectWs(url);
        this.setupInput();
        this.isInitialized = true;
    }

    private async setupCanvas(container: HTMLElement) {
        await this.app.init({
            resizeTo: container,
            background: "#000814",
            antialias: true,
        });
        container.appendChild(this.app.canvas);
        this.app.stage.addChild(this.map);
    }

    private connectWs(url: string) {
        const params: JoinMessage = {
            playerId: "new-player",
            shipId: "ship-leon",
            name: "Admin",
        };
        const query = new URLSearchParams(params).toString();
        this.ws = new WebSocket(`${url}?${query}`);
        this.ws.onmessage = (message: MessageEvent<string>) => {
            this.render(JSON.parse(message.data) as GameState);
        };
    }

    private setupInput() {
        window.addEventListener("keydown", (event) => {
            this.hasClearedInput = false;
            this.keys.add(event.code);
        });

        window.addEventListener("keyup", (event) => {
            this.hasClearedInput = false;
            this.keys.delete(event.code);
        });

        setInterval(() => {
            if (this.keys.size > 0 || !this.hasClearedInput) {
                this.sendInput();
                this.hasClearedInput = true;
            }
        }, 1000 / 30);
    }

    private sendInput() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ playerId: "new-player", inputs: Array.from(this.keys) }));
        }
    }

    private render(state: GameState) {
        this.map.removeChildren();

        for (const ship of state.ships) {
            const resource = GAME_SHIPS[ship.resourceId];

            const shipGraphic = new Graphics()
                .moveTo(20, 0)
                .lineTo(-10, -10)
                .lineTo(-5, 0)
                .lineTo(-10, 10)
                .closePath()
                .stroke({ color: resource.sprite.color, width: resource.sprite.width });
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

        console.log(state.asteroids);

        for (const asteroid of state.asteroids) {
            const resource = GAME_ASTEROIDS[asteroid.resourceId];

            const asteroidGraphic = new Graphics()
                .circle(0, 0, resource.radius)
                .fill(resource.sprite.color);
            asteroidGraphic.position.set(asteroid.x, asteroid.y);

            this.map.addChild(asteroidGraphic);
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
