import { GameEntity } from "./entities";

export type GameState = {
    entities: GameEntity[];
};

export type GameMessage = {
    inputs: Map<string, unknown>;
};
