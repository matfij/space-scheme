import type { ResourceGuid, ShipGuid } from "./resources";

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
        rg: ResourceGuid;
        n: string;
        hp: number;
        sp: number;
        x: number;
        y: number;
        rot: number;
        at: number;
        ac: number;
    }[];
    aliens: {
        id: string;
        rg: ResourceGuid;
        n: string;
        hp: number;
        sp: number;
        x: number;
        y: number;
        rot: number;
    }[];
    asteroids: { id: string; rg: ResourceGuid; hp: number; x: number; y: number }[];
    projectiles: { id: string; rg: ResourceGuid; x: number; y: number; rot: number }[];
};

export type GameStatistics = {
    time: number;
    leaderboard: Record<string, { name: string; kills: number; deaths: number }>;
};

export type GameShip = {
    hp: number;
    sp: number;
    abilityTime: number;
    abilityCooldown: number;
};

export type GameStateEntity = GameState["ships" | "asteroids" | "projectiles"][number];
