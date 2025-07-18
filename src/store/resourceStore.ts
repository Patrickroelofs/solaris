import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { resourceDetails } from "@/enums/Resources";

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
	getAllResources: () => Array<{
		value: number;
		label: string;
	}>;
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
		(set, get) => ({
			...defaultValues,

			addWood: () =>
				set((state) => ({
					wood: state.wood + state.woodPerAction,
				})),
			upgradeWoodPerAction: () => {
				if (get().coins < get().woodUpgradeCost) {
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

			getAllResources: () => {
				const { coins, wood } = get();

				return [
					{
						label: resourceDetails.Coins.name,
						value: coins,
					},
					{
						label: resourceDetails.Wood.name,
						value: wood,
					},
				];
			},
		}),
		{
			name: "resource-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
