import { useEffect, useRef } from "react";

import { GameManger } from "./game-manager";

export const GameComponent = () => {
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
        <div ref={containerRef} style={{ width: "100vw", height: "100vh", overflow: "hidden" }} />
    );
};
