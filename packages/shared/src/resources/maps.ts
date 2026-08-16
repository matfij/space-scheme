import type { GameMap } from "./types";

export const MILKY_WAY: GameMap = {
    guid: "map-milky-way",
    name: "Milky Way",
    imageUri: "/images/maps/milky-way.png",
    gridSize: 400,
    width: 8000,
    height: 3200,
    asteroids: [
        { guid: "ast-small-ball", cooldown: 3 },
        { guid: "ast-med-ball", cooldown: 9 },
        { guid: "ast-large-ball", cooldown: 27 },
        { guid: "ast-super-ball", cooldown: 100 },
    ],
};
