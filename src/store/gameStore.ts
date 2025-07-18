import { create } from "zustand";

type GameStore = {
	playerName: string;
};

type GameActions = {
	setPlayerName: (name: string) => void;
};

export const gameStore = create<GameStore & GameActions>((set) => ({
	playerName: "Player",

	setPlayerName: (name) => set({ playerName: name }),
}));
