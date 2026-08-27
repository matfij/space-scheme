import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useGameStore } from "../../common/game-store";
import { useDraggable } from "../../common/use-draggable";

import styles from "../game-component.module.scss";

export const StatisticsComponent = () => {
    const { t } = useTranslation();
    const { statistics } = useGameStore();
    const [showStatistics, setShowStatistics] = useState(false);
    const { position, handlers } = useDraggable();

    const leaderboard = useMemo(
        () =>
            Object.entries(statistics.leaderboard)
                .map(([id, leader]) => {
                    const events = leader.kills + leader.deaths;
                    const kd = leader.kills / Math.max(leader.deaths, 1);
                    const confidence = events / (events + 50);
                    return {
                        id,
                        ...leader,
                        score: kd * confidence,
                    };
                })
                .sort((a, b) => b.score - a.score),
        [statistics.leaderboard],
    );

    return (
        <>
            {showStatistics && (
                <div
                    className={styles.dialogWrapper}
                    style={{
                        width: "32rem",
                        top: "1rem",
                        left: "calc(50% - 16rem)",
                        transform: `translate(${position.x}px, ${position.y}px)`,
                    }}
                >
                    <div {...handlers} className={styles.dialogHeader}>
                        <div
                            onClick={() => setShowStatistics(false)}
                            className={styles.dialogCloseButton}
                        >
                            <img src="icons/ranking.svg" />
                        </div>
                        <p>{t("statistics.ranking")}</p>
                    </div>
                    <table className={styles.statisticsTable}>
                        <thead>
                            <tr>
                                <th>{t("statistics.place")}</th>
                                <th className={styles.nameColumn}>{t("statistics.player")}</th>
                                <th>{t("statistics.kills")}</th>
                                <th>{t("statistics.deaths")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((leader, index) => (
                                <tr key={leader.id}>
                                    <td>{index + 1}.</td>
                                    <td className={styles.nameColumn}>{leader.name}</td>
                                    <td>{leader.kills}</td>
                                    <td>{leader.deaths}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div
                onClick={() => setShowStatistics((prev) => !prev)}
                className={styles.dialogOpenButton}
                style={{ top: "calc(2% + 4rem)" }}
            >
                <img src="icons/ranking.svg" />
            </div>
        </>
    );
};
