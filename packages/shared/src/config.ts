export const gameConfig = {
    dt: 50 / 1000, // game tick
    playerRespawnThreshold: 5, // seconds to respawn
} as const;

export const serverConfig = {
    port: 3000,
    maxMessageSize: 2 * 1024, // 2 Kib,
    inactiveThreshold: 15_000, // ms inactivity threshold before disconnect
};
