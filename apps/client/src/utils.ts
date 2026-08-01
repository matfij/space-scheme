export const genId = () =>
    (Math.random() + 1).toString(36).substring(2) + (Math.random() + 1).toString(36).substring(2);

export const randRange = (min: number, max: number) => {
    return min + (max - min) * Math.random();
};
