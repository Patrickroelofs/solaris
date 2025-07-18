import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ResourceStore = {
	coins: number;

	wood: number;
	woodPerAction: number;
	woodUpgradeCost: number;
	woodUpgradeLevel: number;
};

type ResourceActions = {
	addWood: () => void;
	upgradeWoodPerAction: () => void;

	sellResources: () => void;

	resetResourceStore: () => void;
};

const defaultValues = {
	coins: 0,
	wood: 0,
	woodPerAction: 1,
	woodUpgradeCost: 10,
	woodUpgradeLevel: 0,
};

export const resourceStore = create<ResourceStore & ResourceActions>()(
	persist<ResourceStore & ResourceActions>(
		(set) => ({
			...defaultValues,

			addWood: () =>
				set((state) => ({
					wood: state.wood + state.woodPerAction,
				})),
			upgradeWoodPerAction: () => {
				if (
					resourceStore.getState().coins <
					resourceStore.getState().woodUpgradeCost
				) {
					alert("Not enough coins to upgrade wood production!");
					return;
				}

				set((state) => ({
					woodPerAction: state.woodPerAction + 1,
					woodUpgradeCost:
						state.woodUpgradeCost + 10 * (state.woodUpgradeLevel + 1),
					woodUpgradeLevel: state.woodUpgradeLevel + 1,
					coins: state.coins - state.woodUpgradeCost,
				}));
			},

			sellResources: () => {
				set((state) => ({
					coins: state.coins + state.wood,
					wood: 0,
				}));
			},

			resetResourceStore: () => {
				set({
					...defaultValues,
				});
			},
		}),
		{
			name: "resource-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
