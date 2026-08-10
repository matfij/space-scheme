import { GAME_SHIPS, genId, isUserNameValid, type ShipGuid } from "@space/shared";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { routes } from "../common/config";
import { useGameStore } from "../common/game-store";
import { ShipItem } from "./ship-item";

import styles from "./lobby-component.module.scss";

export const LobbyComponent = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { startGame } = useGameStore();
    const [playerName, setPlayerName] = useState<string>("");
    const [shipGuid, setShipGuid] = useState<ShipGuid>("ship-falco");
    const [usernameError, setUsernameError] = useState<string>();

    const onShipSelect = (guid: ShipGuid) => {
        setShipGuid(guid);
    };

    const onJoin = () => {
        setUsernameError(undefined);
        if (!isUserNameValid(playerName)) {
            setUsernameError(t("errors.username"));
            return;
        }

        startGame(genId(), playerName, shipGuid);

        navigate(routes.game);
    };

    return (
        <section className={styles.pageWrapper}>
            <div className={styles.formWrapper}>
                <p className={styles.formTitle}>{t("lobby.joinGame")}</p>
                <hr className={styles.formDivider} />
                <div className={styles.inputWrapper}>
                    <label htmlFor="username" className={styles.formLabel}>
                        {t("lobby.username")}
                    </label>
                    <input
                        id="username"
                        autoComplete="username"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className={styles.formInput}
                    />
                    {usernameError && <p className={styles.formError}>{usernameError}</p>}
                </div>
                <div className={styles.inputWrapper}>
                    <label className={styles.formLabel}>{t("lobby.ship")}</label>
                    <div className={styles.shipsWrapper}>
                        {Object.values(GAME_SHIPS).map((ship) => (
                            <ShipItem
                                key={ship.guid}
                                ship={ship}
                                isSelected={ship.guid === shipGuid}
                                onSelect={onShipSelect}
                            />
                        ))}
                    </div>
                </div>
                <button onClick={onJoin} className={styles.formButton}>
                    {t("lobby.join")}
                </button>
            </div>
        </section>
    );
};
