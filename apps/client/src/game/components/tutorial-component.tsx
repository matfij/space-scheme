import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUiStore } from "../../common/ui-store";
import { useDraggable } from "../../common/use-draggable";

import styles from "../game-component.module.scss";

export const TutorialComponent = () => {
    const { t } = useTranslation();
    const { controlsDialog, setControlsDialog } = useUiStore();
    const [showTutorial, setShowTutorial] = useState(controlsDialog.visible);
    const { position, dragHandlers } = useDraggable({
        x: controlsDialog.x,
        y: controlsDialog.y,
    });

    useEffect(() => {
        setControlsDialog({ visible: showTutorial, x: position.x, y: position.y });
    }, [showTutorial, position, setControlsDialog]);

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
                    <div {...dragHandlers} className={styles.dialogHeader}>
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
                onClick={() => setShowTutorial((prev) => !prev)}
                className={styles.dialogOpenButton}
                style={{ top: "calc(2% + 8rem)" }}
            >
                <img src="icons/tutorial.svg" />
            </div>
        </>
    );
};
