import { Application, Container, Graphics } from "pixi.js";

import { InputManager } from "./input-manager";

const speed = 300;

export class GameManager {
    private initialized = false;
    readonly app = new Application();
    readonly map = new Container();
    player = { ship: new Graphics(), x: 200, y: 200, r: 0 };

    async initialize(container: HTMLElement) {
        await this.app.init({
            resizeTo: container,
            background: "#000814",
            antialias: true,
        });

        InputManager.initialize();

        container.replaceChildren();

        this.app.stage.addChild(this.map);

        container.appendChild(this.app.canvas);

        this.app.ticker.add((ticker) => {
            this.update(ticker.deltaTime / 60);
        });

        // dummy asteroid
        this.map.addChild(new Graphics().circle(600, 300, 30).fill(0xff0000));

        this.initialized = true;
    }

    addShip() {
        this.player.ship = new Graphics()
            .moveTo(20, 0)
            .lineTo(-10, -10)
            .lineTo(-5, 0)
            .lineTo(-10, 10)
            .closePath()
            .stroke({
                color: 0x00ffff,
                width: 2,
            });

        this.player.ship.position.set(this.player.x, this.player.y);

        this.map.addChild(this.player.ship);
    }

    update(dt: number) {
        if (InputManager.isPressed("KeyW")) {
            this.player.y -= speed * dt;
        }
        if (InputManager.isPressed("KeyS")) {
            this.player.y += speed * dt;
        }
        if (InputManager.isPressed("KeyA")) {
            this.player.x -= speed * dt;
        }
        if (InputManager.isPressed("KeyD")) {
            this.player.x += speed * dt;
        }

        this.player.ship.position.set(this.player.x, this.player.y);

        this.camera();
    }

    camera() {
        this.map.position.set(
            this.app.screen.width / 2 - this.player.x,
            this.app.screen.height / 2 - this.player.y,
        );
    }

    destroy() {
        if (this.initialized) {
            this.app.canvas.remove();
            this.app.destroy();
        }
    }
}
