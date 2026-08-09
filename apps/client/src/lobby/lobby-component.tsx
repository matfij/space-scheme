import { isUserNameValid } from "@space/shared";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { routes } from "../config";

import styles from "./lobby-component.module.scss";

export const LobbyComponent = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>();
    const [usernameError, setUsernameError] = useState<string>();

    const onJoin = () => {
        setUsernameError(undefined);
        if (!isUserNameValid(username)) {
            setUsernameError(t("errors.username"));
            return;
        }

        // TODO - persist user data

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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.formInput}
                    />
                    {usernameError && <p className={styles.formError}>{usernameError}</p>}
                </div>
                <button onClick={onJoin} className={styles.formButton}>
                    {t("lobby.join")}
                </button>
            </div>
        </section>
    );
};
