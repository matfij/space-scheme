import { useTranslation } from "react-i18next";

export const LobbyComponent = () => {
    const { t } = useTranslation();

    return (
        <section>
            <h1>{t("lobby.lobby")}</h1>
        </section>
    );
};
