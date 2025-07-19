import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Resources } from "@/enums/Resources.tsx";
import { arrayNum, isGreaterThan } from "@/number.ts";
import { resourceStore } from "@/store/resourceStore.ts";

type Upgrade = {
	id: string;
	name: string;
	cost: string;
	multiplier: number;
	unlocked: boolean;
};

type UpgradeStore = {
	upgrades: Record<string, Upgrade>;
};

type UpgradeActions = {
	buyUpgrade: (id: string) => void;
	getAllUpgrades: () => Upgrade[];
	resetUpgrades: () => void;
};

const initialUpgrades: Record<string, Upgrade> = {
	upgrade1: {
		id: "upgrade1",
		name: "Upgrade 1",
		cost: "10",
		multiplier: 1.5,
		unlocked: false,
	},
	upgrade2: {
		id: "upgrade2",
		name: "Upgrade 2",
		cost: "100",
		multiplier: 2.0,
		unlocked: false,
	},
};

export const upgradeStore = create<UpgradeStore & UpgradeActions>()(
	persist<UpgradeStore & UpgradeActions>(
		(set, get) => ({
			upgrades: {
				...initialUpgrades,
			},

			buyUpgrade: (id: string) => {
				const state = get();
				const resources = resourceStore.getState();
				const upgrade = state.upgrades[id];

				if (isGreaterThan(arrayNum(upgrade.cost), resources.Coins)) {
					throw new Error(`Not enough resources to buy upgrade ${id}`);
				}

				const updatedUpgrade: Upgrade = {
					...upgrade,
					unlocked: true,
				};

				resources.sellResource(Resources.Coins, arrayNum(upgrade.cost));

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
