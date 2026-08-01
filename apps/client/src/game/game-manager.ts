import type { Asteroid, Player } from "@space/shared";
import { Application, Container, Graphics } from "pixi.js";

import { genId } from "../utils";
import type { GameEntity } from "./game-definitions";
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

    private player: GameEntity<Player> = {
        id: genId(),
        sprite: new Graphics(),
        x: 200,
        y: 200,
        rot: 0,
        tRot: 0,
        vx: 0,
        vy: 0,
    };
    private asteroids: GameEntity<Asteroid>[] = [];

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
        this.addAsteroid(600, 400, 30);
        this.addAsteroid(600, 500, 30);
        this.addAsteroid(600, 600, 30);
        this.addAsteroid(600, 700, 30);

        this.isInitialized = true;
    }

    addShip() {
        this.player.sprite = new Graphics()
            .moveTo(20, 0)
            .lineTo(-10, -10)
            .lineTo(-5, 0)
            .lineTo(-10, 10)
            .closePath()
            .stroke({
                color: 0x00ffff,
                width: 2,
            });

        this.player.sprite.position.set(this.player.x, this.player.y);

        this.map.addChild(this.player.sprite);
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

        this.player.sprite.position.set(this.player.x, this.player.y);
        this.player.sprite.rotation = this.player.rot;

        this.player.vx *= drag;
        this.player.vy *= drag;

        this.checkCollisions();
        this.camera();
    }

    camera() {
        this.map.position.set(
            this.app.screen.width / 2 - this.player.x,
            this.app.screen.height / 2 - this.player.y,
        );
    }

    checkCollisions() {
        for (const asteroid of this.asteroids) {
            const dx = this.player.x - asteroid.x;
            const dy = this.player.y - asteroid.y;
            const dxy = Math.hypot(dx, dy);
            if (dxy < asteroid.r) {
                this.onCollision(asteroid);
            }
        }
    }

    onCollision(asteroid: GameEntity<Asteroid>) {
        this.map.removeChild(asteroid.sprite);
        this.asteroids = this.asteroids.filter((a) => a.id !== asteroid.id);
        this.player.vx *= -0.5;
        this.player.vy *= -0.5;
    }

    addAsteroid(x: number, y: number, r: number) {
        const sprite = new Graphics().circle(0, 0, r).fill(0xff0000);
        sprite.position.set(x, y);
        this.map.addChild(sprite);
        this.asteroids.push({ id: genId(), sprite, x, y, r });
    }

    destroy() {
        this.isDestroyed = true;
        if (this.isInitialized) {
            this.app.canvas.remove();
            this.app.destroy();
        }
    }
}
