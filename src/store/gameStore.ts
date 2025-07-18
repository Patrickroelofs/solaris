import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { resourceStore } from "./resourceStore";

type GameStore = {
	playerName: string;
};

type GameActions = {
	setPlayerName: (name: string) => void;

	resetGame: () => void;
};

export const gameStore = create<GameStore & GameActions>()(
	persist<GameStore & GameActions>(
		(set) => ({
			playerName: "Player",

			setPlayerName: (name) => set({ playerName: name }),

			resetGame: () => {
				resourceStore.getState().resetResources();
				set({ playerName: "Player" });
			},
		}),
		{
			name: "game-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
