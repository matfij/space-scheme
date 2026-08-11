import {
    MILKY_WAY,
    safeParse,
    safeSerialize,
    type GameState,
    type JoinMessage,
} from "@space/shared";

import { useGameStore } from "../common/game-store";
import { GameRenderer } from "./game-renderer";

export class GameManger {
    private playerId = useGameStore.getState().playerId!;

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
        const params: JoinMessage = {
            playerId: gameState.playerId!,
            playerName: gameState.playerName!,
            shipGuid: gameState.shipGuid!,
        };
        const query = new URLSearchParams(params).toString();
        this.ws = new WebSocket(`${url}?${query}`);
        this.ws.onmessage = (message: MessageEvent<string>) => {
            if (this.isDestroyed) {
                return;
            }
            const state = safeParse<GameState>(message.data);
            this.renderer?.render(state);
        };
    }

    private setupInput() {
        window.addEventListener("keydown", (event) => {
            this.hasClearedInput = false;
            this.keys.add(event.code);
        });

        window.addEventListener("keyup", (event) => {
            this.hasClearedInput = false;
            this.keys.delete(event.code);
        });

        setInterval(() => {
            if (this.keys.size > 0 || !this.hasClearedInput) {
                this.sendInput();
                this.hasClearedInput = true;
            }
        }, 1000 / 30);
    }

    private sendInput() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(safeSerialize({ playerId: this.playerId, inputs: Array.from(this.keys) }));
        }
    }

    destroy() {
        this.isDestroyed = true;

        this.ws?.close();
        this.ws = undefined;

        this.renderer?.destroy();
        this.renderer = undefined;
    }
}
