import { useEffect, useRef } from "react";

import { GameManger } from "./game-manager";
import { StatisticsComponent } from "./statistics-component";

import styles from "./game-component.module.scss";

export const GameComponent = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let disposed = false;
        if (!containerRef.current) {
            return;
        }
        const game = new GameManger();
        (async () => {
            await game.initialize(
                containerRef.current as HTMLDivElement,
                import.meta.env.VITE_BASE_URL,
            );
            if (disposed) {
                game.destroy();
                return;
            }
        })();

        return () => {
            disposed = true;
            game.destroy();
        };
    }, []);

    return (
        <>
            <StatisticsComponent />
            <div ref={containerRef} className={styles.gameWrapper} />
        </>
    );
};
