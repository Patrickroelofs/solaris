import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import { Game } from "./game/Game.tsx";

const rootElement = document.getElementById("root");

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<Game />
		</StrictMode>,
	);
} else {
	console.error('Root element with id "root" not found.');
}
