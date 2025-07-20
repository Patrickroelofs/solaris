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
		resource: ResourcesType;
		amount: BigNumber;
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
				return Object.entries(get())
					.filter(([key]) =>
						Object.values(Resources).includes(key as ResourcesType),
					)
					.map(([key, value]) => ({
						resource: key as ResourcesType,
						amount: value as BigNumber,
					}));
			},
		}),
		{
			name: "resource-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
