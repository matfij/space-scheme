import type { GameEntity } from "@space/shared";

export class SpatialGrid {
    private cellSize: number;
    private cells = new Map<string, GameEntity[]>();

    constructor(cellSize = 100) {
        this.cellSize = cellSize;
    }

    insert(entity: GameEntity) {
        const cx = this.toCell(entity.x);
        const cy = this.toCell(entity.y);
        const key = this.toKey(cx, cy);
        const bucket = this.cells.get(key);
        if (bucket) {
            bucket.push(entity);
        } else {
            this.cells.set(key, [entity]);
        }
    }

    nearby(entity: GameEntity) {
        const cx = this.toCell(entity.x);
        const cy = this.toCell(entity.y);
        const neighbors: GameEntity[] = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const bucket = this.cells.get(this.toKey(cx + dx, cy + dy));
                if (bucket) {
                    neighbors.push(...bucket);
                }
            }
        }
        return neighbors;
    }

    clear() {
        this.cells.clear();
    }

    private toCell(value: number) {
        return Math.floor(value / this.cellSize);
    }

    private toKey(cx: number, cy: number) {
        return `${cx},${cy}`;
    }
}
