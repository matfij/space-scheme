import fastify from "fastify";

const app = fastify({ logger: true });

app.get("/health", async () => ({ status: "ok" }));

app.listen({ port: 3000 }, (error) => {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }
});
