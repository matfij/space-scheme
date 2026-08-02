export const genId = () => crypto.randomUUID();

export const randRange = (min: number, max: number) => {
    return min + (max - min) * Math.random();
};
