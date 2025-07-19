const Resources = {
	Wood: "Wood",
	Coins: "Coins",
	Stone: "Stone",
} as const;

type ResourcesType = (typeof Resources)[keyof typeof Resources];

export { Resources, type ResourcesType };
