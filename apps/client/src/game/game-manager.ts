import type { AsteroidEntity, EntityKind, GameEntity, PlayerEntity } from "@space/shared";
import { Application, Container, Graphics } from "pixi.js";

import { genId, randRange } from "../utils";
import { SpatialGrid } from "./collision-manager";
import type { VisualEntity } from "./game-definitions";
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

    private grid = new SpatialGrid();

    private player: VisualEntity<PlayerEntity> = {
        id: genId(),
        type: "Player",
        mass: 100,
        radius: 10,
        sprite: new Graphics(),
        x: 200,
        y: 200,
        rot: 0,
        tRot: 0,
        vx: 0,
        vy: 0,
    };
    private asteroids: VisualEntity<AsteroidEntity>[] = [];

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
        this.addAsteroid(200, 400);
        this.addAsteroid(300, 400);
        this.addAsteroid(400, 400);
        this.addAsteroid(500, 400);
        this.addAsteroid(600, 400);
        this.addAsteroid(600, 500);
        this.addAsteroid(600, 600);
        this.addAsteroid(600, 700);

        this.isInitialized = true;
    }

    addShip() {
        this.player.sprite = new Graphics()
            .moveTo(20, 0)
            .lineTo(-10, -10)
            .lineTo(-5, 0)
            .lineTo(-10, 10)
            .closePath()
            .stroke({ color: 0x00ffff, width: 2 })
            .circle(0, 0, this.player.radius)
            .stroke({ color: 0x00ffff, width: 1 });

        this.player.sprite.position.set(this.player.x, this.player.y);

        this.map.addChild(this.player.sprite);
    }

    update(dt: number) {
        this.movePlayer(dt);
        this.moveAsteroids(dt);
        this.checkCollisions();
        this.camera();
    }

    camera() {
        this.map.position.set(
            this.app.screen.width / 2 - this.player.x,
            this.app.screen.height / 2 - this.player.y,
        );
    }

    movePlayer(dt: number) {
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
    }

    moveAsteroids(dt: number) {
        for (const asteroid of this.asteroids) {
            asteroid.x += dt * asteroid.vx;
            asteroid.y += dt * asteroid.vy;
            asteroid.sprite.position.set(asteroid.x, asteroid.y);
        }
    }

    checkCollisions() {
        const entities = [this.player, ...this.asteroids];
        this.grid.clear();
        entities.forEach((entity) => this.grid.insert(entity));
        const checked = new Set<string>();

        for (const a of entities) {
            for (const b of this.grid.nearby(a)) {
                if (a.id === b.id) {
                    continue;
                }
                const pairKey = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
                if (checked.has(pairKey)) {
                    continue;
                }
                checked.add(pairKey);
                const dxy = Math.hypot(a.x - b.x, a.y - b.y);
                if (dxy < a.radius + b.radius) {
                    this.resolveCollision(a, b);
                }
            }
        }
    }

    resolveCollision(a: GameEntity, b: GameEntity) {
        const key = [a.type, b.type].sort().join("-") as `${EntityKind}-${EntityKind}`;
        switch (key) {
            case "Asteroid-Player": {
                const player = a.type === "Player" ? a : b;
                const asteroid = a.type === "Asteroid" ? a : b;
                player.vx *= -1;
                player.vy *= -1;
                this.removeSprite(asteroid.id);
                break;
            }
            case "Asteroid-Asteroid": {
                a.vx *= -1;
                a.vy *= -1;
                b.vx *= -1;
                b.vy *= -1;
                break;
            }
        }
    }

    addAsteroid(x: number, y: number) {
        const r = randRange(10, 30);
        const mass = randRange(80, 120) * r;

        const sprite = new Graphics().circle(0, 0, r).fill("#ffa");
        sprite.position.set(x, y);
        this.map.addChild(sprite);
        this.asteroids.push({
            id: genId(),
            type: "Asteroid",
            mass,
            sprite,
            x,
            y,
            vx: randRange(-100, 100),
            vy: randRange(-100, 100),
            radius: r,
        });
    }

    removeSprite(id: string) {
        const index = this.asteroids.findIndex((a) => a.id === id);
        const entity = this.asteroids.splice(index, 1)[0];
        this.map.removeChild(entity.sprite);
    }

    destroy() {
        this.isDestroyed = true;
        if (this.isInitialized) {
            this.app.canvas.remove();
            this.app.destroy();
        }
    }
}
