import websocket from "@fastify/websocket";
import { GameMessage, JoinMessage, safeParse } from "@space/shared";
import fastify from "fastify";

import { GameManager } from "./engine/game-manager";

const app = fastify({ logger: true });
app.register(websocket);

app.get("/health", async () => ({ status: "ok" }));

const players = new Map();
const gameManager = new GameManager();

setInterval(() => {
    gameManager.update(50 / 1000);
    for (const socket of players.values()) {
        if (socket.readyState === socket.OPEN) {
            socket.send(gameManager.serialize());
        }
    }
}, 50);

app.register(async (appInstance) => {
    appInstance.get("/ws", { websocket: true }, (socket, request) => {
        const { playerId, shipGuid, playerName } = request.query as JoinMessage;

        const existing = players.get(playerId);
        if (existing && existing !== socket) {
            existing.close();
        }

        players.set(playerId, socket);
        if (!gameManager.hasShip(playerId)) {
            gameManager.addShip(playerId, playerName, shipGuid);
            gameManager.initialize();
        }

        socket.on("message", (raw) => {
            const message = safeParse<GameMessage>(raw);
            gameManager.setInputs(message.playerId, message.inputs);
        });

        socket.on("close", () => {
            if (players.get(playerId) === socket) {
                players.delete(playerId);
                // TODO - ship inactive state
            }
        });
    });
});

app.listen({ port: 3000 }, (error) => {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }
});
