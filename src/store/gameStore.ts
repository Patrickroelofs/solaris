import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useFlowStore } from "./flowStore";
import { resourceStore } from "./resourceStore";

type GameStore = {
	playerName: string;
};

type GameActions = {
	setPlayerName: (name: string) => void;

	resetGame: () => void;
	resetGameStore: () => void;
};

export const gameStore = create<GameStore & GameActions>()(
	persist<GameStore & GameActions>(
		(set) => ({
			playerName: "Player",

			setPlayerName: (name) => set({ playerName: name }),

			resetGame: () => {
				resourceStore.getState().resetResourceStore();
				useFlowStore.getState().resetFlowStore();
				gameStore.getState().resetGameStore();
			},

			resetGameStore: () => {
				set({ playerName: "Player" });
			},
		}),
		{
			name: "game-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
