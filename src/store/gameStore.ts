import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { playerStore } from "@/store/playerStore.ts";
import { upgradeStore } from "@/store/upgradeStore.ts";
import { useFlowStore } from "./flowStore";
import { resourceStore } from "./resourceStore";

// biome-ignore lint/complexity/noBannedTypes: This will be filled with data later
type GameStore = {};

type GameActions = {
	resetGame: () => void;
	resetGameStore: () => void;
};

export const gameStore = create<GameStore & GameActions>()(
	persist<GameStore & GameActions>(
		(set) => ({
			resetGame: () => {
				resourceStore.getState().resetResourceStore();
				useFlowStore.getState().resetFlowStore();
				playerStore.getState().resetPlayerStore();
				upgradeStore.getState().resetUpgrades();
				gameStore.getState().resetGameStore();
			},

			resetGameStore: () => {
				set({});
			},
		}),
		{
			name: "game-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
