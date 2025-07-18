import { CoinIcon, LogIcon } from "@phosphor-icons/react";
import type { JSX } from "react";

export const Resources = {
	Wood: "Wood",
	Coins: "Coins",
} as const;

type Resources = (typeof Resources)[keyof typeof Resources];

type ResourceDetail = {
	icon: JSX.Element;
	name: string;
};

const resourceDetails: Record<Resources, ResourceDetail> = {
	[Resources.Wood]: {
		icon: <LogIcon />,
		name: Resources.Wood,
	},
	[Resources.Coins]: {
		icon: <CoinIcon />,
		name: Resources.Coins,
	},
};

function getResourceDetail(key: string): ResourceDetail | undefined {
	if (key in Resources) {
		return resourceDetails[key as Resources];
	}
	return undefined;
}

export { resourceDetails, getResourceDetail };
