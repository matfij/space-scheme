import type { ShipGuid } from "./resources";

export type GameState = {
    ships: {
        id: string;
        resourceGuid: string;
        name: string;
        hp: number;
        sp: number;
        x: number;
        y: number;
        rot: number;
    }[];
    asteroids: { id: string; resourceGuid: string; hp: number; x: number; y: number }[];
    projectiles: { id: string; resourceGuid: string; x: number; y: number; rot: number }[];
};

export type JoinMessage = {
    playerId: string;
    playerName: string;
    shipGuid: ShipGuid;
};

export type GameMessage = {
    playerId: string;
    inputs: string[];
};
