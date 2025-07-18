import { CoinIcon, LogIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { resourceStore } from "@/store/resourceStore";

function Inventory() {
	const resources = resourceStore();

	return (
		<Card className="absolute bottom-0 left-0 w-full h-[30dvh] rounded-none">
			<CardHeader>
				<CardTitle className="text-3xl mb-4">Inventory</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex gap-4">
					<Tooltip>
						<TooltipTrigger>
							<div className="w-32 h-32 flex flex-col justify-center items-center bg-gray-100 rounded-lg">
								<CoinIcon size={48} />
								<p>{resources.coins}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Coins</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger>
							<div className="w-32 h-32 flex flex-col justify-center items-center bg-gray-100 rounded-lg">
								<LogIcon size={48} />
								<p>{resources.wood}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Wood</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</CardContent>
		</Card>
	);
}

export default Inventory;
