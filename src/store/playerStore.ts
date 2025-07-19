import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ResourcesType } from "@/enums/Resources.tsx";

type PlayerStore = {
	playerName: string;
	currentAction?: ResourcesType;
};

type PlayerActions = {
	setPlayerName: (name: string) => void;
	setCurrentAction: (action?: ResourcesType) => void;
	resetPlayerStore: () => void;
};

export const playerStore = create<PlayerStore & PlayerActions>()(
	persist<PlayerStore & PlayerActions>(
		(set) => ({
			playerName: "Player",
			currentAction: undefined,

			setPlayerName: (name) => set({ playerName: name }),
			setCurrentAction: (action) => set({ currentAction: action }),

			resetPlayerStore: () =>
				set({
					playerName: "Player",
					currentAction: undefined,
				}),
		}),
		{
			name: "game-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
