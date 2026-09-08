import { gameConfig } from "@space/shared";
import { useEffect, useRef, useState, type PointerEvent } from "react";

import styles from "../game-component.module.scss";
import controlsStyles from "./controls-component.module.scss";

const config = {
    dotSize: 24,
    joystickRadius: 48,
    initialPosition: { x: 40, y: 40 },
};

type ControlComponentProps = {
    sendKeys: (keys: string[]) => void;
};

export const ControlsComponent = (props: ControlComponentProps) => {
    const [position, setPosition] = useState(config.initialPosition);
    const [showControls, setShowControls] = useState(false);
    const [keys, setKeys] = useState<string[]>([]);
    const sendKeysInterval = useRef<number>(null);

    useEffect(() => {
        if (!showControls) {
            if (keys.length) {
                setKeys([]);
            }
            if (sendKeysInterval.current) {
                clearInterval(sendKeysInterval.current);
            }
            return;
        }

        sendKeysInterval.current = setInterval(() => {
            props.sendKeys(keys);
        }, gameConfig.dt);

        return () => {
            if (sendKeysInterval.current) {
                clearInterval(sendKeysInterval.current);
            }
        };
    }, [showControls, keys, props.sendKeys]);

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

    const resetJoystick = () => {
        setPosition(config.initialPosition);
        setKeys([]);
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

        let dx = clampedX > config.dotSize ? 1 : clampedX < -config.dotSize ? -1 : 0;
        const dy = clampedY > config.dotSize ? 1 : clampedY < -config.dotSize ? -1 : 0;

        const newKeys: string[] = [];
        if (dx === 1) {
            newKeys.push("KeyD");
        } else if (dx === -1) {
            newKeys.push("KeyA");
        }
        if (dy === 1) {
            newKeys.push("KeyS");
        } else if (dy === -1) {
            newKeys.push("KeyW");
        }

        setKeys(newKeys);
    };

    return (
        <>
            {showControls && (
                <div
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={resetJoystick}
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
