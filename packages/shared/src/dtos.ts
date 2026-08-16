import type { ShipGuid } from "./resources";

export type JoinMessage = {
    type: "join";
    data: JointInput;
};

export type ControlMessage = {
    type: "control";
    data: ControlInput;
};

export type StateMessage = {
    type: "state";
    data: GameState;
};

export type StatisticsMessage = {
    type: "statistics";
    data: GameStatistics;
};

export type GameMessage = JoinMessage | ControlMessage | StateMessage | StatisticsMessage;

export type JointInput = {
    playerId: string;
    playerName: string;
    shipGuid: ShipGuid;
};

export type ControlInput = {
    playerId: string;
    inputs: string[];
};

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

export type GameStatistics = {
    time: number;
    leaderboard: Record<string, { name: string; kills: number; deaths: number }>;
};
