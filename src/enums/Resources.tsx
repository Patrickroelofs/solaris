const Resources = {
	Wood: "Wood",
	Coins: "Coins",
} as const;

type ResourcesType = (typeof Resources)[keyof typeof Resources];

type ResourceDetail = {
	name: string;
};

const resourceDetails: Record<ResourcesType, ResourceDetail> = {
	[Resources.Wood]: {
		name: Resources.Wood,
	},
	[Resources.Coins]: {
		name: Resources.Coins,
	},
};

export { resourceDetails, Resources, type ResourcesType };
