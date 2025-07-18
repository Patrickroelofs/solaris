import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ResourceStore = {
	coins: number;
	wood: number;
};

type ResourceActions = {
	addWood: (amount: number) => void;
	sellResources: () => void;

	resetResources: () => void;
};
export const resourceStore = create<ResourceStore & ResourceActions>()(
	persist<ResourceStore & ResourceActions>(
		(set) => ({
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

			resetResources: () => {
				set({ coins: 0, wood: 0 });
			},
		}),
		{
			name: "resource-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
