import { useState } from "react";

import styles from "../game-component.module.scss";
import controlsStyles from "./controls-component.module.scss";

export const ControlsComponent = () => {
    const [showControls, setShowControls] = useState(false);

    return (
        <>
            {showControls && (
                <div className={`${styles.dialogWrapper} ${controlsStyles.joystickWrapper}`}>
                    <div className={controlsStyles.joystickItem} />
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
