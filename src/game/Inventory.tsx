import { gsap } from "gsap";
import React, { useEffect } from "react";
import { IconMapper } from "@/components/icon-mapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Resources } from "@/enums/Resources";
import { resourceStore } from "@/store/resourceStore";

function Inventory() {
	const resources = resourceStore();
	const allResources = resources.getAllResources();

	const cardRef = React.useRef<HTMLDivElement>(null);

	const hasResources = resources
		.getAllResources()
		.some((resource) => resource.value > 0);

	useEffect(() => {
		if (cardRef.current) {
			if (hasResources) {
				gsap.to(cardRef.current, {
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: "power2.out",
				});
			} else {
				gsap.to(cardRef.current, {
					opacity: 0,
					y: 100,
					duration: 0.3,
					ease: "power2.in",
				});
			}
		}
	}, [hasResources]);

	return (
		<Card
			className="absolute bottom-0 left-0 w-full h-[30dvh] rounded-none"
			ref={cardRef}
		>
			<CardHeader>
				<CardTitle className="text-3xl mb-4">Inventory</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex gap-4">
					{allResources.map((resource) => {
						if (resource.value <= 0) return null;

						return (
							<Tooltip key={resource.label}>
								<TooltipTrigger>
									<ContextMenu>
										<ContextMenuTrigger
											disabled={resource.label === Resources.Coins}
										>
											<div className="w-32 h-32 flex flex-col justify-center items-center bg-gray-100 rounded-lg">
												<IconMapper name={resource.label} />
												<p className="font-bold mt-2">{resource.value}</p>
											</div>
										</ContextMenuTrigger>
										<ContextMenuContent>
											<ContextMenuSub>
												<ContextMenuSubTrigger>Sell</ContextMenuSubTrigger>
												<ContextMenuSubContent>
													{[1, 10, 100, 1000, 10000, 100000, 1000000].map(
														(amount) =>
															resource.value >= amount ? (
																<ContextMenuItem
																	key={amount}
																	onClick={() =>
																		resources.sellResource(
																			resource.label,
																			amount,
																		)
																	}
																>
																	{`Sell ${amount.toLocaleString()}`}
																</ContextMenuItem>
															) : null,
													)}
													<ContextMenuItem
														onClick={() =>
															resources.sellResource(
																resource.label,
																resource.value,
															)
														}
													>
														Sell All
													</ContextMenuItem>
												</ContextMenuSubContent>
											</ContextMenuSub>
										</ContextMenuContent>
									</ContextMenu>
								</TooltipTrigger>
								<TooltipContent>
									<p>{resource.label}</p>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

export default Inventory;
