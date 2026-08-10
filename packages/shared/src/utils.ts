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

export const isUserNameValid = (value?: string) => {
    return value !== undefined && value?.length && value.length >= 3 && value.length <= 12;
};

export const genId = (length = 16) => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    return Array.from(bytes, (byte) => byte.toString(36).padStart(2, "0"))
        .join("")
        .slice(0, length);
};
