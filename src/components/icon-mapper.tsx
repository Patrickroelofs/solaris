import {
	CoinIcon,
	CubeIcon,
	IconContext,
	LogIcon,
} from "@phosphor-icons/react";
import { Resources, type ResourcesType } from "@/enums/Resources";

function IconMapper({ name }: { name: ResourcesType }) {
	switch (name) {
		case Resources.Stone:
			return (
				<IconContext.Provider value={{ size: 48 }}>
					<CubeIcon />
				</IconContext.Provider>
			);
		case Resources.Wood:
			return (
				<IconContext.Provider value={{ size: 48 }}>
					<LogIcon />
				</IconContext.Provider>
			);
		case Resources.Coins:
			return (
				<IconContext.Provider value={{ size: 48 }}>
					<CoinIcon />
				</IconContext.Provider>
			);
		default:
			return null;
	}
}

export { IconMapper };
