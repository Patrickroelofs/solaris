import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Resources, type ResourcesType } from "@/enums/Resources";
import { add, arrayNum, renderTotal, subtract } from "@/number";

type ResourceStore = {
	Coins: number[];
	Wood: number[];
	Stone: number[];
};

type ResourceActions = {
	addResource: (resource: ResourcesType, amount: string) => void;
	sellResource: (resource: ResourcesType, amount: number[]) => void;
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
	Stone: [],
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
				set((state) => ({
					[resource]: subtract(amount, state[resource]),
				}));
			},

			resetResourceStore: () => {
				set({
					...defaultValues,
				});
			},

			getAllResources: () => {
				const { Coins, Wood, Stone } = get();

				return [
					{
						label: Resources.Coins,
						value: renderTotal(Coins),
					},
					{
						label: Resources.Wood,
						value: renderTotal(Wood),
					},
					{
						label: Resources.Stone,
						value: renderTotal(Stone),
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
