import { GAME_SHIPS, type ShipGuid, type ShipResource } from "@space/shared";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./lobby-component.module.scss";

type ShipItemProps = {
    ship: ShipResource;
    isSelected?: boolean;
    onSelect: (guid: ShipGuid) => void;
};

export const ShipItem = (props: ShipItemProps) => {
    const { t } = useTranslation();

    const maxStats = useMemo(
        () => ({
            mass: 1.1 * Math.max(...Object.values(GAME_SHIPS).map((ship) => ship.mass)),
            health: 1.1 * Math.max(...Object.values(GAME_SHIPS).map((ship) => ship.health)),
            shield: 1.1 * Math.max(...Object.values(GAME_SHIPS).map((ship) => ship.shield)),
            speed: 1.1 * Math.max(...Object.values(GAME_SHIPS).map((ship) => ship.maxSpeed)),
            acceleration:
                1.1 * Math.max(...Object.values(GAME_SHIPS).map((ship) => ship.acceleration)),
        }),
        [],
    );

    const onSelect = () => {
        props.onSelect(props.ship.guid);
    };

    return (
        <div
            onClick={onSelect}
            className={styles.shipItem}
            style={{
                opacity: props.isSelected ? 1 : 0.8,
                borderLeft: `2px solid ${
                    props.isSelected
                        ? props.ship.sprite.color
                        : `color-mix(in srgb, ${props.ship.sprite.color} 30%, transparent)`
                }`,
            }}
        >
            <p style={{ color: props.ship.sprite.color }}>{props.ship.name}</p>

            <div className={styles.shipStatItem}>
                <p>{t("ship.hp")}</p>
                <progress value={props.ship.health} max={maxStats.health} />
            </div>

            <div className={styles.shipStatItem}>
                <p>{t("ship.shield")}</p>
                <progress value={props.ship.shield} max={maxStats.shield} />
            </div>

            <div className={styles.shipStatItem}>
                <p>{t("ship.speed")}</p>
                <progress value={props.ship.maxSpeed} max={maxStats.speed} />
            </div>

            <div className={styles.shipStatItem}>
                <p>{t("ship.acceleration")}</p>
                <progress value={props.ship.acceleration} max={maxStats.acceleration} />
            </div>
        </div>
    );
};
