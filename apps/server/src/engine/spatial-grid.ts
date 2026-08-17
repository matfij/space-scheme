import type { GameEntity } from "@space/shared";

export class SpatialGrid {
    private cellSize: number;
    private cells = new Map<number, GameEntity[]>();

    constructor(cellSize = 100) {
        this.cellSize = cellSize;
    }

    insert(entity: GameEntity) {
        const range = Math.ceil(entity.radius / this.cellSize);
        const cx = this.toCell(entity.x);
        const cy = this.toCell(entity.y);

        if (range <= 1) {
            this.addToCell(cx, cy, entity);
            return;
        }

        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                this.addToCell(cx + dx, cy + dy, entity);
            }
        }
    }

    *nearby(entity: GameEntity) {
        const range = Math.max(1, Math.ceil(entity.radius / this.cellSize));
        const cx = this.toCell(entity.x);
        const cy = this.toCell(entity.y);
        const seen = new Set<string>();

        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const bucket = this.cells.get(this.toKey(cx + dx, cy + dy));
                if (bucket) {
                    for (const entity of bucket) {
                        if (!seen.has(entity.id)) {
                            seen.add(entity.id);
                            yield entity;
                        }
                    }
                }
            }
        }
    }

    clear() {
        this.cells.clear();
    }

    private addToCell(cx: number, cy: number, entity: GameEntity) {
        const key = this.toKey(cx, cy);
        const bucket = this.cells.get(key);
        if (bucket) {
            bucket.push(entity);
        } else {
            this.cells.set(key, [entity]);
        }
    }

    private toCell(value: number) {
        return Math.floor(value / this.cellSize);
    }

    private toKey(cx: number, cy: number) {
        return cx * 100000 + cy;
    }
}
