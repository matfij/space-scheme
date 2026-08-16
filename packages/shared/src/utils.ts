import type { GameMessage } from "./dtos";

export const safeParse = <T>(data: unknown) => {
    if (typeof data === "string") {
        return JSON.parse(data) as T;
    } else if (typeof data === "object") {
        return JSON.parse(`${data}`) as T;
    } else {
        return data as T;
    }
};

export const safeSerialize = (data: GameMessage) => JSON.stringify(data);

export const isUsernameValid = (value?: string) => {
    return value !== undefined && value?.length && value.length >= 3 && value.length <= 12;
};

export const isGuidValid = (value?: string) => {
    return value !== undefined && value?.length && value.length >= 4 && value.length <= 20;
};

export const genId = (length = 16) => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    return Array.from(bytes, (byte) => byte.toString(36).padStart(2, "0"))
        .join("")
        .slice(0, length);
};

export const getRandomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};

export const lerp = (a: number, b: number, t: number) => {
    return a + (b - a) * t;
};

export const lerpAngle = (a: number, b: number, t: number) => {
    const twoPi = Math.PI * 2;

    let delta = (b - a) % twoPi;

    if (delta > Math.PI) {
        delta -= twoPi;
    } else if (delta < -Math.PI) {
        delta += twoPi;
    }

    return a + delta * t;
};
