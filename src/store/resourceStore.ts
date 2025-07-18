import { create } from "zustand";

type ResourceStore = {
	coins: number;
	wood: number;
};

type ResourceActions = {
	addWood: (amount: number) => void;
	sellResources: () => void;
};

export const resourceStore = create<ResourceStore & ResourceActions>((set) => ({
	coins: 0,
	wood: 0,

	addWood: (amount) =>
		set((state) => ({
			wood: state.wood + amount,
		})),
	sellResources: () => {
		set((state) => ({
			coins: state.coins + state.wood,
			wood: 0,
		}));
	},
}));
