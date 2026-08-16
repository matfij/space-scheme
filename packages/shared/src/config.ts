export const gameConfig = {
    dt: 50 / 1000, // game tick
    playerRespawnThreshold: 5, // seconds to respawn
} as const;

export const serverConfig = {
    port: 3000,
    host: "127.0.0.1",
    maxMessageSize: 2 * 1024, // 2 Kib,
    inactiveThreshold: 15_000, // ms inactivity threshold before disconnect
};

export const gameColors = {
    background: "#860f0f",
    grid: "rgb(53, 47, 47)",
    fontLight: "#fafafa",
    healthBarLow: "#333333",
    healthBarHigh: "#e63946",
    shieldBarLow: "#333333",
    shieldBarHigh: "#469cd2",
};
