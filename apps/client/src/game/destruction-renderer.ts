import type { Container } from "pixi.js";

export type DestroyedGraphic = {
    graphic: Container;
    life: number;
};

export class DestructionRenderer {
    private static readonly LIFE_DECREMENT = 0.05;
    private static readonly V_Y = 0.5;
    private static readonly V_ROT = 0.2;

    static createEffect(graphic: Container) {
        return {
            graphic,
            life: 1,
        };
    }

    static render(destroyedGraphics: DestroyedGraphic[]) {
        for (let i = destroyedGraphics.length - 1; i >= 0; i--) {
            const effect = destroyedGraphics[i];

            if (!effect?.graphic || !effect.graphic.position) {
                destroyedGraphics.splice(i, 1);
                continue;
            }

            effect.life -= this.LIFE_DECREMENT;
            effect.graphic.alpha = Math.max(0, effect.life);
            effect.graphic.position.y += this.V_Y;
            effect.graphic.rotation += this.V_ROT;

            effect.graphic.scale.x = Math.max(0.33, effect.graphic.scale.x * 0.99);
            effect.graphic.scale.y = Math.max(0.33, effect.graphic.scale.y * 0.99);

            if (effect.life <= 0) {
                effect.graphic.parent?.removeChild(effect.graphic);
                effect.graphic.destroy({ children: true });
                destroyedGraphics.splice(i, 1);
            }
        }
    }
}
