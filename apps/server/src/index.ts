import websocket from "@fastify/websocket";
import { GameMessage, PlayerEntity } from "@space/shared";
import fastify from "fastify";

const app = fastify({ logger: true });
app.register(websocket);

app.get("/health", async () => ({ status: "ok" }));

const players = new Map();
const state = { players: {} as Record<string, PlayerEntity> };

app.register(async (appInstance) => {
    appInstance.get("/ws", { websocket: true }, (socket, req) => {
        const id = crypto.randomUUID();
        players.set(socket, id);

        //  const { gameId, ship } = req.params;
        // state.players[id] = { x: 0, y: 0, inputs: [s] };

        socket.on("message", (raw: string) => {
            const message = JSON.parse(raw.toString()) as GameMessage;
            console.log({ data: message });

            // state.players[id].inputs = (JSON.parse(message) as GameMessage).inputs;
        });

        socket.on("close", () => {
            delete state.players[id];
            players.delete(id);
        });
    });
});

app.listen({ port: 3000 }, (error) => {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }
});
