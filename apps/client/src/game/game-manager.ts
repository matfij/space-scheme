import { Application, Container, Graphics, wordWrap } from "pixi.js";

export class GameManager {
    private initialized = false;
    readonly app = new Application();
    readonly map = new Container();
    player = { x: 200, y: 200 };

    async initialize(container: HTMLElement) {
        await this.app.init({
            resizeTo: container,
            background: "#000814",
            antialias: true,
        });
        container.replaceChildren();
        this.app.stage.addChild(this.map);
        container.appendChild(this.app.canvas);
        this.initialized = true;
    }

    addShip() {
        const ship = new Graphics()
            .moveTo(this.player.x, this.player.y)
            .lineTo(this.player.x - 10, this.player.y - 10)
            .lineTo(this.player.x - 5, this.player.y)
            .lineTo(this.player.x - 10, this.player.y + 10)
            .closePath()
            .stroke({ color: 0x00ffff, width: 2 });

        ship.position.set(0, 0);

        this.map.addChild(ship);
    }

    camera() {
        this.map.position.set(
            this.app.screen.width / 2 - this.player.x,
            this.app.screen.width / 2 - this.player.y,
        );
    }

    destroy() {
        if (this.initialized) {
            this.app.canvas.remove();
            this.app.destroy();
        }
    }
}
