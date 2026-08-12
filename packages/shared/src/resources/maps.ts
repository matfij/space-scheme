import type { GameMap } from "./types";

export const MILKY_WAY: GameMap = {
    guid: "map-milky-way",
    name: "Milky Way",
    imageUri: "/images/maps/milky-way.png",
    gridSize: 400,
    width: 2000,
    height: 1000,
    spawnLocations: [
        { x: 200, y: 200 },
        { x: 400, y: 200 },
        { x: 600, y: 200 },
        { x: 800, y: 200 },
        { x: 200, y: 400 },
        { x: 200, y: 600 },
        { x: 200, y: 800 },
    ],
    asteroids: [
        { guid: "ast-small-ball", cooldown: 3 },
        { guid: "ast-med-ball", cooldown: 10 },
    ],
};
