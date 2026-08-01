export const genId = () =>
    (Math.random() + 1).toString(36).substring(2) + (Math.random() + 1).toString(36).substring(2);
