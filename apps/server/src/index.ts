import websocket from "@fastify/websocket";
import { GameMessage, JoinMessage, ShipEntity } from "@space/shared";
import fastify from "fastify";

import { GameManager } from "./engine/game-manager";
import { genId } from "./utils";

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
        const { playerId, shipId, name } = request.query as JoinMessage;
        players.set(playerId, socket);

        console.log("[JOINED]", { playerId, shipId, name });

        gameManager.addShip(playerId, shipId);
        gameManager.initialize();

        socket.on("message", (raw: string) => {
            const message = JSON.parse(raw.toString()) as GameMessage;

            console.log("[INPUT]", message);

            gameManager.setInputs(message.playerId, message.inputs);
        });

        socket.on("close", () => {
            players.delete(playerId);
        });
    });
});

app.listen({ port: 3000 }, (error) => {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }
});
