import {
    gameConfig,
    MILKY_WAY,
    safeParse,
    safeSerialize,
    type GameMessage,
    type JointInput,
} from "@space/shared";

import { useGameStore } from "../common/game-store";
import { GameRenderer } from "./renderers/game-renderer";

export class GameManger {
    private playerId = useGameStore.getState().playerId!;
    private inputInterval?: ReturnType<typeof setInterval>;

    private isDestroyed = false;
    private hasClearedInput = false;

    private renderer?: GameRenderer;
    private ws?: WebSocket;
    private keys = new Set<string>();

    async initialize(container: HTMLElement, url: string) {
        this.renderer = new GameRenderer();
        await this.renderer.initialize(container, MILKY_WAY);

        if (this.isDestroyed) {
            return;
        }

        this.connectWs(url);
        this.setupInput();
    }

    private connectWs(url: string) {
        const gameState = useGameStore.getState();
        const params: JointInput = {
            playerId: gameState.playerId!,
            playerName: gameState.playerName!,
            shipGuid: gameState.shipGuid!,
        };
        const query = new URLSearchParams(params).toString();
        this.ws = new WebSocket(`${url}?${query}`);
        this.ws.onmessage = (rawMessage: MessageEvent<string>) => {
            if (this.isDestroyed) {
                return;
            }
            const message = safeParse<GameMessage>(rawMessage.data);
            switch (message.type) {
                case "state": {
                    this.renderer?.render(message.data);
                    const ship = message.data.ships.find((ship) => ship.id === params.playerId);
                    if (ship) {
                        useGameStore.getState().setShip({
                            hp: ship.hp,
                            sp: ship.sp,
                            abilityTime: ship.at,
                            abilityCooldown: ship.ac,
                        });
                    }
                    break;
                }
                case "statistics": {
                    useGameStore.getState().updateStatistics(message.data);
                    break;
                }
            }
        };
    }

    private setupInput() {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);

        this.inputInterval = setInterval(() => {
            if (this.keys.size > 0 || !this.hasClearedInput) {
                this.sendInput();
                this.hasClearedInput = true;
            }
        }, gameConfig.dt);
    }

    private onKeyDown = (event: KeyboardEvent) => {
        this.hasClearedInput = false;
        this.keys.add(event.code);
    };

    private onKeyUp = (event: KeyboardEvent) => {
        this.hasClearedInput = false;
        this.keys.delete(event.code);
    };

    private sendInput() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(
                safeSerialize({
                    type: "control",
                    data: { playerId: this.playerId, inputs: Array.from(this.keys) },
                }),
            );
        }
    }

    destroy() {
        this.isDestroyed = true;

        clearInterval(this.inputInterval);
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);

        this.ws?.close();
        this.ws = undefined;

        this.renderer?.destroy();
        this.renderer = undefined;
    }
}
