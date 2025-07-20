import BigNumber from "bignumber.js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Resources, type ResourcesType } from "@/enums/Resources";

type ResourceStore = {
	Coins: BigNumber;
	Wood: BigNumber;
	Stone: BigNumber;
};

type ResourceActions = {
	addResource: (resource: ResourcesType, amount: BigNumber) => void;
	sellResource: (resource: ResourcesType, amount: BigNumber) => void;
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
	Coins: BigNumber(0),
	Wood: BigNumber(0),
	Stone: BigNumber(0),
};

export const resourceStore = create<ResourceStore & ResourceActions>()(
	persist<ResourceStore & ResourceActions>(
		(set, get) => ({
			...defaultValues,

			addResource: (resource, amount) => {
				set((state) => ({
					[resource]: state[resource].plus(amount),
				}));
			},

			sellResource: (resource, amount) => {
				set((state) => ({
					[resource]: state[resource].minus(amount),
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
						value: {
							full: Coins.toFixed(2),
							short: Coins.toFormat(0, BigNumber.ROUND_DOWN),
						},
					},
					{
						label: Resources.Wood,
						value: {
							full: Wood.toFixed(2),
							short: Wood.toFormat(0, BigNumber.ROUND_DOWN),
						},
					},
					{
						label: Resources.Stone,
						value: {
							full: Stone.toFixed(2),
							short: Stone.toFormat(0, BigNumber.ROUND_DOWN),
						},
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
