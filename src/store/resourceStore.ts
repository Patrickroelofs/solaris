import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Resources, type ResourcesType } from "@/enums/Resources";
import { add, arrayNum, renderTotal, subtract } from "@/number";

type ResourceStore = {
	Coins: number[];
	Wood: number[];
};

type ResourceActions = {
	addResource: (resource: ResourcesType, amount: string) => void;
	sellResource: (resource: ResourcesType, amount: string | "all") => void;
	resetResourceStore: () => void;

	getAllResources: () => Array<{
		label: ResourcesType;
		value: {
			full: string;
			short: string;
		};
	}>;
};

const defaultValues = {
	Coins: [],
	Wood: [],
};

export const resourceStore = create<ResourceStore & ResourceActions>()(
	persist<ResourceStore & ResourceActions>(
		(set, get) => ({
			...defaultValues,

			addResource: (resource, amount) => {
				set((state) => ({
					[resource]: add(arrayNum(amount), state[resource]),
				}));
			},

			sellResource: (resource, amount) => {
				if (amount === "all") {
					set((state) => ({
						Coins: add(state[resource], state.Coins),
						[resource]: subtract(state[resource], state[resource]),
					}));

					return;
				}

				set((state) => ({
					Coins: add(arrayNum(amount), state.Coins),
					[resource]: subtract(arrayNum(amount), state[resource]),
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
						value: renderTotal(Coins),
					},
					{
						label: Resources.Wood,
						value: renderTotal(Wood),
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
