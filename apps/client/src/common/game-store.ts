import type { ShipGuid } from "@space/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GameStore = {
    playerId?: string;
    playerName?: string;
    shipGuid?: ShipGuid;
    startGame: (playerId: string, playerName: string, shipGuid: ShipGuid) => void;
    clearAll: () => void;
};

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            startGame: (playerId: string, playerName: string, shipGuid: ShipGuid) =>
                set({ playerId, playerName, shipGuid }),
            clearAll: () => set({ playerName: undefined, shipGuid: undefined }),
        }),
        {
            name: "space-scheme-store",
        },
    ),
);
