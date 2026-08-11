import { GAME_PROJECTILES, GAME_SHIPS, type ShipResource } from "@space/shared";

export const calculateFirepower = (ship: ShipResource) =>
    (1 / ship.projectTileCooldown) *
    ship.projectileGuids.reduce((sum, curr) => (sum += GAME_PROJECTILES[curr].damage), 0);

export const calculateAcceleration = (ship: ShipResource) => ship.acceleration * ship.rotationSpeed;

export const SHIP_MAX_STATS = {
    firepower: 1.1 * Math.max(...Object.values(GAME_SHIPS).map((ship) => calculateFirepower(ship))),
    health: 1.1 * Math.max(...Object.values(GAME_SHIPS).map((ship) => ship.health)),
    shield: 1.1 * Math.max(...Object.values(GAME_SHIPS).map((ship) => ship.shield)),
    speed: 1.1 * Math.max(...Object.values(GAME_SHIPS).map((ship) => ship.maxSpeed)),
    acceleration:
        1.1 * Math.max(...Object.values(GAME_SHIPS).map((ship) => calculateAcceleration(ship))),
};
