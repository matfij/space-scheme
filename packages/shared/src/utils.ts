export const safeParse = <T>(data: unknown) => {
    if (typeof data === "string") {
        return JSON.parse(data) as T;
    } else if (typeof data === "object") {
        return JSON.parse(`${data}`) as T;
    } else {
        return data as T;
    }
};

export const safeSerialize = (data: unknown) => JSON.stringify(data);
