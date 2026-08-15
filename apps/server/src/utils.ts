import { join } from "node:path";

export const genId = () => crypto.randomUUID();

export const randRange = (min: number, max: number) => {
    return min + (max - min) * Math.random();
};

export const logFile = () => {
    const date = new Date().toISOString().slice(0, 10);
    return join("./logs", `${date}.log`);
};
