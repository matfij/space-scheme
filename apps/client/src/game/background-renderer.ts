import { gameColors, type GameMap } from "@space/shared";
import { Assets, Sprite, type Graphics } from "pixi.js";

export class BackgroundRenderer {
    static renderGrid(grid: Graphics, map: GameMap) {
        grid.clear();
        for (let x = -map.width; x <= 2 * map.width; x += map.gridSize) {
            grid.moveTo(x + 0.5, -map.height).lineTo(x + 0.5, 2 * map.height);
        }
        for (let y = -map.height; y <= 2 * map.height; y += map.gridSize) {
            grid.moveTo(-map.width, y + 0.5).lineTo(2 * map.width, y + 0.5);
        }
        grid.stroke({ color: gameColors.grid, width: 1 });
    }

    static async renderBackground(background: Sprite, map: GameMap) {
        const texture = await Assets.load(map.imageUri);
        background.texture = texture;
        background.width = map.width;
        background.height = map.height;
        background.tint = 0x777777;
    }
}
