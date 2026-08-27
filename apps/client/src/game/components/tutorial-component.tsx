import { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "../game-component.module.scss";

export const TutorialComponent = () => {
    const { t } = useTranslation();
    const [showTutorial, setShowTutorial] = useState(false);

    return (
        <>
            {showTutorial && (
                <div
                    className={styles.dialogWrapper}
                    style={{ width: "16rem", left: "calc(50% - 8rem)" }}
                >
                    <div className={styles.dialogHeader}>
                        <p>{t("tutorial.controls")}</p>
                        <div
                            onClick={() => setShowTutorial(false)}
                            className={styles.dialogCloseButton}
                        >
                            <img src="icons/contract.svg" />
                        </div>
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
            {!showTutorial && (
                <div
                    onClick={() => setShowTutorial(true)}
                    className={styles.dialogOpenButton}
                    style={{ top: "calc(2% + 8rem)" }}
                >
                    <img src="icons/tutorial.svg" />
                </div>
            )}
        </>
    );
};
