import websocket, { type WebSocket } from "@fastify/websocket";
import {
    GAME_SHIPS,
    gameConfig,
    GameMessage,
    isGuidValid,
    isUsernameValid,
    JoinMessage,
    MILKY_WAY,
    safeParse,
    serverConfig,
} from "@space/shared";
import fastify from "fastify";

import { GameManager } from "./engine/game-manager";
import { logFile } from "./utils";

const app = fastify({
    logger: { file: logFile() },
});
app.register(websocket, { options: { maxPayload: serverConfig.maxMessageSize } });

app.get("/health", async () => ({ status: "ok" }));

const players = new Map();
const online = new WeakSet<WebSocket>();
const disconnectTimers = new Map<string, NodeJS.Timeout>();

const gameManager = new GameManager(MILKY_WAY);

// game state broadcast
setInterval(() => {
    try {
        gameManager.update(gameConfig.dt);
    } catch (err) {
        app.log.error(`Game update error: ${err}`);
        return;
    }
    for (const socket of players.values()) {
        if (socket.readyState === socket.OPEN) {
            socket.send(gameManager.serialize());
        }
    }
}, 50);

// disconnect inactive players
setInterval(() => {
    for (const [id, socket] of players) {
        if (!online.has(socket)) {
            socket.terminate();
            players.delete(id);
            gameManager.removePlayer(id);
            continue;
        }
        online.delete(socket);
        socket.ping();
    }
}, serverConfig.inactiveThreshold);

app.register(async (appInstance) => {
    appInstance.get("/ws", { websocket: true }, (socket, request) => {
        // initial join
        const { playerId, shipGuid, playerName } = request.query as JoinMessage;

        if (!isGuidValid(playerId) || !isUsernameValid(playerName) || !GAME_SHIPS[shipGuid]) {
            app.log.warn(`Invalid join params: ${playerId}, ${playerName}, ${shipGuid}`);
            socket.close();
            return;
        }

        const existing = players.get(playerId);
        if (existing && existing !== socket) {
            existing.close();
        }

        players.set(playerId, socket);
        gameManager.joinPlayer(playerId, playerName, shipGuid);

        // keeping alive
        online.add(socket);
        socket.on("pong", () => {
            online.add(socket);
        });

        const pendingRemoval = disconnectTimers.get(playerId);
        if (pendingRemoval) {
            clearTimeout(pendingRemoval);
            disconnectTimers.delete(playerId);
        }

        // sending controls
        socket.on("message", (raw) => {
            try {
                const message = safeParse<GameMessage>(raw);
                gameManager.setPlayerInputs(playerId, message.inputs);
            } catch (err) {
                app.log.warn(`Game message error: ${err}`);
            }
        });

        // disconnect
        socket.on("close", () => {
            if (players.get(playerId) === socket) {
                players.delete(playerId);
                const timer = setTimeout(() => {
                    gameManager.removePlayer(playerId);
                    disconnectTimers.delete(playerId);
                }, serverConfig.inactiveThreshold);
                disconnectTimers.set(playerId, timer);
            }
        });
    });
});

app.listen({ port: serverConfig.port, host: "127.0.0.1" }, (error) => {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }
});
