import BigNumber from "bignumber.js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Resources, type ResourcesType } from "@/enums/Resources.tsx";
import { resourceStore } from "@/store/resourceStore.ts";

type Upgrade = {
	id: string;
	name: string;
	cost: string;
	multiplier: number;
	unlocked: boolean;
	resource: ResourcesType;
};

type UpgradeStore = {
	upgrades: Record<string, Upgrade>;
};

type UpgradeActions = {
	buyUpgrade: (id: string, currency: ResourcesType) => void;
	getAllUpgrades: () => Upgrade[];
	resetUpgrades: () => void;
};

const initialUpgrades: Record<string, Upgrade> = {
	improvedAxe1: {
		id: "improvedAxe1",
		name: "Improved Axe",
		cost: "10",
		multiplier: 2,
		unlocked: false,
		resource: Resources.Wood,
	},
	improvedPickaxe1: {
		id: "improvedPickaxe1",
		name: "Improved Pickaxe",
		cost: "10",
		multiplier: 2,
		unlocked: false,
		resource: Resources.Stone,
	},
};

export const upgradeStore = create<UpgradeStore & UpgradeActions>()(
	persist<UpgradeStore & UpgradeActions>(
		(set, get) => ({
			upgrades: {
				...initialUpgrades,
			},

			buyUpgrade: (id: string, currency: ResourcesType) => {
				const state = get();
				const resources = resourceStore.getState();
				const upgrade = state.upgrades[id];

				if (BigNumber(upgrade.cost).gt(resources[currency])) {
					throw new Error(`Not enough ${currency} to buy upgrade ${id}`);
				}

				const updatedUpgrade: Upgrade = {
					...upgrade,
					unlocked: true,
				};

				resources.sellResource(currency, BigNumber(upgrade.cost));

				set({
					upgrades: { ...state.upgrades, [id]: updatedUpgrade },
				});
			},

			getAllUpgrades: () => {
				return Object.values(get().upgrades);
			},

			resetUpgrades: () => {
				set({
					upgrades: { ...initialUpgrades },
				});
			},
		}),
		{
			name: "upgrade-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
