import { useEffect, useRef } from "react";

import { GameManager } from "./game-manager";

export const GameComponent = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let disposed = false;
        if (!containerRef.current) {
            return;
        }
        const game = new GameManager();
        (async () => {
            await game.initialize(containerRef.current as HTMLDivElement);
            if (disposed) {
                game.destroy();
                return;
            }
            game.addShip();
        })();

        return () => {
            disposed = true;
            game.destroy();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ width: "100vw", height: "100vh", overflow: "hidden" }} />
    );
};
