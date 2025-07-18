import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import { Game } from "./game/Game.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Game />
	</StrictMode>,
);
