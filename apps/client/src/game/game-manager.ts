import { Application, Container, Graphics } from "pixi.js";

import { InputManager } from "./input-manager";

const acceleration = 3000;
const maxSpeed = 300;
const drag = 0.992;
const rotationSpeed = 3;

export class GameManager {
    private isInitialized = false;
    private isDestroyed = false;
    readonly app = new Application();
    readonly map = new Container();
    player = {
        ship: new Graphics(),
        x: 200,
        y: 200,
        rot: 0,
        tRot: 0,
        vx: 0,
        vy: 0,
    };

    async initialize(container: HTMLElement) {
        await this.app.init({
            resizeTo: container,
            background: "#000814",
            antialias: true,
        });

        if (this.isDestroyed) {
            this.app.destroy({ removeView: true });
            return;
        }

        InputManager.initialize();

        container.replaceChildren();

        this.app.stage.addChild(this.map);

        container.appendChild(this.app.canvas);

        this.app.ticker.add((ticker) => {
            this.update(ticker.deltaTime / 60);
        });

        // dummy asteroid
        this.map.addChild(new Graphics().circle(600, 300, 30).fill(0xff0000));

        this.isInitialized = true;
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
        let dx = 0;
        let dy = 0;

        if (InputManager.isPressed("KeyA")) {
            dx--;
        }
        if (InputManager.isPressed("KeyD")) {
            dx++;
        }
        if (InputManager.isPressed("KeyW")) {
            dy--;
        }
        if (InputManager.isPressed("KeyS")) {
            dy++;
        }

        if (dx !== 0 || dy !== 0) {
            const length = Math.hypot(dx, dy);
            dx /= length;
            dy /= length;

            this.player.vx += dx * dt * acceleration;
            this.player.vy += dy * dt * acceleration;
            this.player.tRot = Math.atan2(dy, dx);
        }

        const currentSpeed = Math.hypot(this.player.vx, this.player.vy);
        if (currentSpeed > maxSpeed) {
            const scale = maxSpeed / currentSpeed;
            this.player.vx *= scale;
            this.player.vy *= scale;
        }

        this.player.x += this.player.vx * dt;
        this.player.y += this.player.vy * dt;

        let dRot = this.player.tRot - this.player.rot;
        dRot = Math.atan2(Math.sin(dRot), Math.cos(dRot));
        const maxDRot = rotationSpeed * dt;
        if (Math.abs(dRot) <= maxDRot) {
            this.player.rot = this.player.tRot;
        } else {
            this.player.rot += Math.sign(dRot) * maxDRot;
        }

        this.player.ship.position.set(this.player.x, this.player.y);
        this.player.ship.rotation = this.player.rot;

        this.player.vx *= drag;
        this.player.vy *= drag;

        this.camera();
    }

    camera() {
        this.map.position.set(
            this.app.screen.width / 2 - this.player.x,
            this.app.screen.height / 2 - this.player.y,
        );
    }

    destroy() {
        this.isDestroyed = true;
        if (this.isInitialized) {
            this.app.canvas.remove();
            this.app.destroy();
        }
    }
}
