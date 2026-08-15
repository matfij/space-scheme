export const gameConfig = {
    dt: 50 / 1000, // game tick
    inactiveThreshold: 15_000, // ms inactivity threshold before disconnect
    playerRespawnThreshold: 5, // seconds to respawn
    serverPort: 3000,
} as const;
