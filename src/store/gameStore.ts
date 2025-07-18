import type { Edge } from "reactflow";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { resourceStore } from "./resourceStore";

type GameStore = {
	playerName: string;
};

type GameActions = {
	setPlayerName: (name: string) => void;

	resetGame: () => void;

	edges: Edge[];
	setEdges: (edges: Edge[]) => void;
	resetEdges: () => void;
};

export const gameStore = create<GameStore & GameActions>()(
	persist<GameStore & GameActions>(
		(set) => ({
			playerName: "Player",
			edges: [],

			setPlayerName: (name) => set({ playerName: name }),

			resetGame: () => {
				resourceStore.getState().resetResources();
				set({ playerName: "Player" });
			},

			setEdges: (edges) => set({ edges }),
			resetEdges: () => set({ edges: [] }),
		}),
		{
			name: "game-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
