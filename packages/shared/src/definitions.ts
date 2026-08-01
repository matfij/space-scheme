export type Coordinate = {
    id: string;
    x: number;
    y: number;
};

export type Player = Coordinate & {
    vx: number;
    vy: number;
    rot: number;
    tRot: number;
};

export type Asteroid = Coordinate & {
    r: number;
};
