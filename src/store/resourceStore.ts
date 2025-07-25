import BigNumber from "bignumber.js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Resources, type ResourcesType } from "@/enums/Resources";
import { useFlowStore } from "./flowStore";

type Resource = {
	value: BigNumber;
	perAction: BigNumber;
};

type ResourceStore = Record<ResourcesType, Resource>;

type ResourceActions = {
	addResource: (resource: ResourcesType, deltaTime: number) => void;
	updatePerAction: (resource: ResourcesType, perAction: number) => void;
	sellResource: (
		resource: ResourcesType,
		amount: BigNumber,
		addTo?: ResourcesType,
	) => void;
	resetResourceStore: () => void;
	getAllResources: () => Array<{
		resource: ResourcesType;
		value: BigNumber;
	}>;

	hireWorker: (allowedConnections: ResourcesType[], cost: number) => void;
};

const defaultValues = {
	Coins: {
		value: BigNumber(0),
		perAction: BigNumber(0),
	},
	Wood: {
		value: BigNumber(0),
		perAction: BigNumber(1),
	},
	Stone: {
		value: BigNumber(0),
		perAction: BigNumber(1),
	},
};

export const resourceStore = create<ResourceStore & ResourceActions>()(
	persist<ResourceStore & ResourceActions>(
		(set, get) => ({
			...defaultValues,

			addResource: (resource, deltaTime) => {
				const state = get();
				const resourceToAdd = BigNumber(state[resource].perAction)
					.times(deltaTime)
					.dividedBy(1000);

				const newValue = BigNumber(state[resource].value).plus(resourceToAdd);

				set((state) => ({
					[resource]: {
						...state[resource],
						value: newValue,
					},
				}));
			},

			updatePerAction: (resource, perAction) => {
				set((state) => ({
					[resource]: {
						...state[resource],
						perAction: BigNumber(state[resource].perAction).times(perAction),
					},
				}));
			},

			sellResource: (resource, amount, addTo) => {
				set((state) => ({
					[resource]: {
						...state[resource],
						value: BigNumber(state[resource].value).minus(amount),
					},
				}));

				if (addTo) {
					set((state) => ({
						[addTo]: {
							...state[addTo],
							value: BigNumber(state[addTo].value).plus(amount.times(0.5)),
						},
					}));
				}
			},

			hireWorker: (allowedConnections, cost) => {
				const workerCost = BigNumber(cost);
				const currentCoins = BigNumber(get().Coins.value);

				if (currentCoins.isLessThan(workerCost)) {
					console.warn("Not enough coins to hire a worker.");
					return;
				}

				useFlowStore.getState().addNode({
					id: `worker-${Date.now()}`,
					type: "workerNode",
					data: {},
					position: { x: 0, y: 0 },
				});
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
					.map(([key]) => ({
						resource: key as ResourcesType,
						value: get()[key as ResourcesType].value,
					}));
			},
		}),
		{
			name: "resource-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
