import { GAME_SHIPS } from "@space/shared";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useGameStore } from "../../common/game-store";
import { useDraggable } from "../../common/use-draggable";

import styles from "../game-component.module.scss";

export const ShipComponent = () => {
    const { t } = useTranslation();
    const { ship, shipGuid } = useGameStore();
    const [showShip, setShowShip] = useState(false);
    const { position, handlers } = useDraggable();

    const resource = shipGuid ? GAME_SHIPS[shipGuid] : undefined;

    if (!resource) {
        return <></>;
    }

    const abilityProgress =
        ship.abilityTime > 0
            ? ship.abilityTime / resource.ability.duration
            : 1 - ship.abilityCooldown / resource.ability.cooldown;

    return (
        <>
            {showShip && (
                <div
                    className={styles.dialogWrapper}
                    style={{
                        width: "16rem",
                        top: "1rem",
                        right: "20rem",
                        transform: `translate(${position.x}px, ${position.y}px)`,
                    }}
                >
                    <div {...handlers} className={styles.dialogHeader}>
                        <div
                            onClick={() => setShowShip(false)}
                            className={styles.dialogCloseButton}
                        >
                            <img src="icons/ship.svg" />
                        </div>
                        <p>{t("ship.ship")}</p>
                    </div>
                    <div className={styles.shipRow}>
                        <img src="icons/health.svg" />
                        <progress
                            className={styles.healthProgress}
                            value={ship.hp}
                            max={resource.health}
                        />
                    </div>
                    <div className={styles.shipRow}>
                        <img src="icons/shield.svg" />
                        <progress
                            className={styles.shieldProgress}
                            value={ship.sp}
                            max={resource.shield}
                        />
                    </div>
                    <div className={styles.shipRow}>
                        <img src="icons/ability.svg" />
                        <progress
                            className={styles.abilityProgress}
                            value={abilityProgress}
                            max={1}
                        />
                    </div>
                </div>
            )}

            <div
                onClick={() => setShowShip((prev) => !prev)}
                className={styles.dialogOpenButton}
                style={{ top: "calc(2%)" }}
            >
                <img src="icons/ship.svg" />
            </div>
        </>
    );
};
