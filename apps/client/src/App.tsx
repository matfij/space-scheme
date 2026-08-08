import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { routes } from "./config";
import { GameComponent } from "./game/game-component";
import { LobbyComponent } from "./lobby/lobby-component";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.root} element={<LobbyComponent />} />
                <Route path={routes.game} element={<GameComponent />} />
                <Route path="*" element={<Navigate to={routes.root} replace />} />
            </Routes>
        </BrowserRouter>
    );
};
