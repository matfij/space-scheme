import type { GameMap } from "./types";

export const MILKY_WAY: GameMap = {
    guid: "map-milky-way",
    name: "Milky Way",
    imageUri: "/images/maps/milky-way.png",
    gridSize: 400,
    width: 2000,
    height: 1000,
    asteroids: [
        { guid: "ast-small-ball", cooldown: 30 },
        { guid: "ast-med-ball", cooldown: 100 },
    ],
};
