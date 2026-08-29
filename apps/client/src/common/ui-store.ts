import { create } from "zustand";
import { persist } from "zustand/middleware";

type DialogPosition = {
    visible: boolean;
    x: number;
    y: number;
};

type UiStore = {
    shipDialog: DialogPosition;
    statisticsDialog: DialogPosition;
    controlsDialog: DialogPosition;
    setShipDialog: (dialog: DialogPosition) => void;
    setStatisticsDialog: (dialog: DialogPosition) => void;
    setControlsDialog: (dialog: DialogPosition) => void;
};

export const useUiStore = create<UiStore>()(
    persist(
        (set) => ({
            shipDialog: { visible: true, x: 0, y: 0 },
            statisticsDialog: { visible: true, x: 0, y: 0 },
            controlsDialog: { visible: true, x: 0, y: 0 },
            setShipDialog: (dialog: DialogPosition) => set({ shipDialog: dialog }),
            setStatisticsDialog: (dialog: DialogPosition) => set({ statisticsDialog: dialog }),
            setControlsDialog: (dialog: DialogPosition) => set({ controlsDialog: dialog }),
        }),
        { name: "space-scheme-store-ui" },
    ),
);
