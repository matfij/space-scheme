import { useState, type PointerEvent } from "react";

import styles from "../game-component.module.scss";
import controlsStyles from "./controls-component.module.scss";

const config = {
    dotSize: 24,
    joystickRadius: 48,
};

export const ControlsComponent = () => {
    const [position, setPosition] = useState({ x: 40, y: 40 });
    const [showControls, setShowControls] = useState(false);

    const onPointerDown = (event: PointerEvent) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        updatePosition(event);
    };

    const onPointerMove = (event: PointerEvent) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
            return;
        }
        updatePosition(event);
    };

    const updatePosition = (event: PointerEvent) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const center = bounds.width / 2;
        const pointerX = event.clientX - bounds.left;
        const pointerY = event.clientY - bounds.top;
        const vectorX = pointerX - center;
        const vectorY = pointerY - center;
        const distance = Math.hypot(vectorX, vectorY);
        const scale = distance > config.joystickRadius ? config.joystickRadius / distance : 1;
        const clampedX = vectorX * scale;
        const clampedY = vectorY * scale;

        setPosition({
            x: center - config.dotSize + clampedX,
            y: center - config.dotSize + clampedY,
        });
    };

    return (
        <>
            {showControls && (
                <div
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    className={`${styles.dialogWrapper} ${controlsStyles.joystickWrapper}`}
                >
                    <div
                        className={controlsStyles.joystickItem}
                        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                    />
                </div>
            )}

            <div
                onClick={() => setShowControls((prev) => !prev)}
                className={styles.dialogOpenButton}
                style={{ top: "calc(2% + 8rem)" }}
            >
                <img src="icons/controls.svg" />
            </div>
        </>
    );
};
