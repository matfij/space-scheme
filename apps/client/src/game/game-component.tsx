import { useCallback, useEffect, useRef } from "react";

import { ControlsComponent } from "./components/controls-component";
import { ShipComponent } from "./components/ship-component";
import { StatisticsComponent } from "./components/statistics-component";
import { TutorialComponent } from "./components/tutorial-component";
import { GameManger } from "./game-manager";

import styles from "./game-component.module.scss";

export const GameComponent = () => {
    const gameManager = useRef<GameManger>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let disposed = false;
        if (!containerRef.current) {
            return;
        }

        const manager = new GameManger();
        gameManager.current = manager;

        (async () => {
            await manager.initialize(
                containerRef.current as HTMLDivElement,
                import.meta.env.VITE_BASE_URL,
            );
            if (disposed) {
                manager.destroy();
                return;
            }
        })();

        return () => {
            disposed = true;
            manager.destroy();
            if (gameManager.current === manager) {
                gameManager.current = null;
            }
        };
    }, []);

    const onJoystickKeys = useCallback((keys: string[]) => {
        gameManager.current?.sendJoystickKeys(keys);
    }, []);

    return (
        <>
            <ShipComponent />
            <StatisticsComponent />
            <ControlsComponent sendKeys={onJoystickKeys} />
            <TutorialComponent />
            <div ref={containerRef} className={styles.gameWrapper} />
        </>
    );
};
