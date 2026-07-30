export class InputManager {
    private static initialized = false;
    private static keys = new Set<string>();

    static initialize() {
        if (this.initialized) {
            return;
        }

        window.addEventListener("keydown", (event) => {
            this.keys.add(event.code);
        });

        window.addEventListener("keyup", (event) => {
            this.keys.delete(event.code);
        });

        this.initialized = false;
    }

    static isPressed(code: string) {
        return this.keys.has(code);
    }
}
