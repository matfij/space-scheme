import type { GameShip, GameStatistics, ShipGuid } from "@space/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GameStore = {
    playerId?: string;
    playerName?: string;
    shipGuid?: ShipGuid;
    statistics: GameStatistics;
    ship: GameShip;
    startGame: (playerId: string, playerName: string, shipGuid: ShipGuid) => void;
    updateStatistics: (statistics: GameStatistics) => void;
    setShip: (ship: GameShip) => void;
    clearAll: () => void;
};

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            statistics: { time: 0, leaderboard: {} },
            ship: { hp: 0, sp: 0, abilityTime: 0, abilityCooldown: 0 },
            startGame: (playerId: string, playerName: string, shipGuid: ShipGuid) =>
                set({
                    playerId,
                    playerName,
                    shipGuid,
                    statistics: { time: 0, leaderboard: {} },
                }),
            updateStatistics: (statistics: GameStatistics) => set({ statistics }),
            setShip: (ship: GameShip) => set({ ship }),
            clearAll: () =>
                set({
                    playerName: undefined,
                    shipGuid: undefined,
                    statistics: { time: 0, leaderboard: {} },
                    ship: { hp: 0, sp: 0, abilityTime: 0, abilityCooldown: 0 },
                }),
        }),
        {
            name: "space-scheme-store",
        },
    ),
);
