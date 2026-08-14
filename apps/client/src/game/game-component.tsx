import { useEffect, useRef } from "react";

import { useGameStore } from "../common/game-store";
import { GameManger } from "./game-manager";

import styles from "./game-component.module.scss";

export const GameComponent = () => {
    const { statistics } = useGameStore();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let disposed = false;
        if (!containerRef.current) {
            return;
        }
        const game = new GameManger();
        (async () => {
            await game.initialize(containerRef.current as HTMLDivElement, "ws://localhost:3000/ws");
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
            <div className={styles.statisticsWrapper}>
                <p>Statistics</p>
                <p>Time: {statistics.time}</p>
                <hr />
                {Object.values(statistics.leaderboard).map((leader) => (
                    <p key={leader.name}>
                        {leader.name} | {leader.kills} | {leader.deaths}
                    </p>
                ))}
            </div>
            <div
                ref={containerRef}
                style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
            />
        </>
    );
};
