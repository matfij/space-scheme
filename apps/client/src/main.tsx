import "./common/main.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./common/i18n";
import { AppComponent } from "./app";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppComponent />
    </StrictMode>,
);
