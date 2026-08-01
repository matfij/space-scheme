import type { EntityKind, BaseEntity } from "@space/shared";
import type { Graphics } from "pixi.js";

export type VisualEntity<T extends BaseEntity<EntityKind>> = T & {
    sprite: Graphics;
};
