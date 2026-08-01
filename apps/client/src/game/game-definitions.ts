import type { Graphics } from "pixi.js";

export type GameEntity<T> = T & {
    sprite: Graphics;
};
