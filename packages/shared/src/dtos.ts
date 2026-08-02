export type GameState = {
    ships: { id: string; resourceId: string; x: number; y: number; rot: number }[];
    asteroids: { resourceId: string; x: number; y: number }[];
    projectiles: { resourceId: string; x: number; y: number }[];
};

export type JoinMessage = {
    playerId: string;
    shipId: string;
    name: string;
};

export type GameMessage = {
    playerId: string;
    inputs: string[];
};
