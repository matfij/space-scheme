import type { ShipGuid, ShipResource } from "@space/shared";
import { useTranslation } from "react-i18next";

import { calculateAcceleration, calculateFirepower, SHIP_MAX_STATS } from "./ship-utils";

import styles from "./lobby-component.module.scss";

type ShipItemProps = {
    ship: ShipResource;
    isSelected?: boolean;
    onSelect: (guid: ShipGuid) => void;
};

export const ShipItem = (props: ShipItemProps) => {
    const { t } = useTranslation();

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
                <p>{t("ship.firepower")}</p>
                <progress value={calculateFirepower(props.ship)} max={SHIP_MAX_STATS.firepower} />
            </div>

            <div className={styles.shipStatItem}>
                <p>{t("ship.hp")}</p>
                <progress value={props.ship.health} max={SHIP_MAX_STATS.health} />
            </div>

            <div className={styles.shipStatItem}>
                <p>{t("ship.shield")}</p>
                <progress value={props.ship.shield} max={SHIP_MAX_STATS.shield} />
            </div>

            <div className={styles.shipStatItem}>
                <p>{t("ship.speed")}</p>
                <progress value={props.ship.maxSpeed} max={SHIP_MAX_STATS.speed} />
            </div>

            <div className={styles.shipStatItem}>
                <p>{t("ship.acceleration")}</p>
                <progress
                    value={calculateAcceleration(props.ship)}
                    max={SHIP_MAX_STATS.acceleration}
                />
            </div>
        </div>
    );
};
