import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Resources, type ResourcesType } from "@/enums/Resources";

type ResourceStore = {
	Coins: number;
	Wood: number;
	woodPerAction: number;
	woodUpgradeCost: number;
	woodUpgradeLevel: number;
};

type ResourceActions = {
	addWood: () => void;
	upgradeWoodPerAction: () => void;
	sellResource: (resource: ResourcesType, amount: number) => void;
	resetResourceStore: () => void;
	getAllResources: () => Array<{
		label: ResourcesType;
		value: number;
	}>;
};

const defaultValues = {
	Coins: 0,
	Wood: 0,
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
					Wood: state.Wood + state.woodPerAction,
				})),
			upgradeWoodPerAction: () => {
				if (get().Coins < get().woodUpgradeCost) {
					alert("Not enough coins to upgrade wood production!");
					return;
				}

				set((state) => ({
					woodPerAction: state.woodPerAction + 1,
					woodUpgradeCost:
						state.woodUpgradeCost + 10 * (state.woodUpgradeLevel + 1),
					woodUpgradeLevel: state.woodUpgradeLevel + 1,
					coins: state.Coins - state.woodUpgradeCost,
				}));
			},

			sellResource: (resource, amount) => {
				if (resource === Resources.Coins) {
					throw new Error("Cannot sell coins directly.");
				}

				set((state) => ({
					[resource]: state[resource] - amount,
					Coins: state.Coins + state[resource],
				}));
			},

			resetResourceStore: () => {
				set({
					...defaultValues,
				});
			},

			getAllResources: () => {
				const { Coins, Wood } = get();

				return [
					{
						label: Resources.Coins,
						value: Coins,
					},
					{
						label: Resources.Wood,
						value: Wood,
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
