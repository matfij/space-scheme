import type { GameStatistics, ShipGuid } from "@space/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GameStore = {
    playerId?: string;
    playerName?: string;
    shipGuid?: ShipGuid;
    statistics: GameStatistics;
    startGame: (playerId: string, playerName: string, shipGuid: ShipGuid) => void;
    updateStatistics: (statistics: GameStatistics) => void;
    clearAll: () => void;
};

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            statistics: { time: 0, leaderboard: {} },
            startGame: (playerId: string, playerName: string, shipGuid: ShipGuid) =>
                set({
                    playerId,
                    playerName,
                    shipGuid,
                    statistics: { time: 0, leaderboard: {} },
                }),
            updateStatistics: (statistics: GameStatistics) => set({ statistics }),
            clearAll: () =>
                set({
                    playerName: undefined,
                    shipGuid: undefined,
                    statistics: { time: 0, leaderboard: {} },
                }),
        }),
        {
            name: "space-scheme-store",
        },
    ),
);
