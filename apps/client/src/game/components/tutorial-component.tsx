import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useDraggable } from "../../common/use-draggable";

import styles from "../game-component.module.scss";

export const TutorialComponent = () => {
    const { t } = useTranslation();
    const [showTutorial, setShowTutorial] = useState(true);
    const { position, handlers } = useDraggable();

    return (
        <>
            {showTutorial && (
                <div
                    className={styles.dialogWrapper}
                    style={{
                        width: "16rem",
                        top: "20%",
                        left: "calc(50% - 8rem)",
                        transform: `translate(${position.x}px, ${position.y}px)`,
                    }}
                >
                    <div {...handlers} className={styles.dialogHeader}>
                        <div
                            onClick={() => setShowTutorial(false)}
                            className={styles.dialogCloseButton}
                        >
                            <img src="icons/tutorial.svg" />
                        </div>
                        <p>{t("tutorial.controls")}</p>
                    </div>
                    <div className={styles.tutorialRowsWrapper}>
                        <div className={styles.tutorialRow}>
                            {t("tutorial.movement")} <b>{t("tutorial.movementKeys")}</b>
                        </div>
                        <div className={styles.tutorialRow}>
                            {t("tutorial.shooting")} <b>{t("tutorial.shootingKey")}</b>
                        </div>
                        <div className={styles.tutorialRow}>
                            {t("tutorial.ability")} <b>{t("tutorial.abilityKey")}</b>
                        </div>
                    </div>
                </div>
            )}
            <div
                onClick={() => setShowTutorial(true)}
                className={styles.dialogOpenButton}
                style={{ top: "calc(2% + 8rem)" }}
            >
                <img src="icons/tutorial.svg" />
            </div>
        </>
    );
};
