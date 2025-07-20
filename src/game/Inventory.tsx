import { TabsContent } from "@radix-ui/react-tabs";
import BigNumber from "bignumber.js";
import { IconMapper } from "@/components/icon-mapper";
import { Card, CardContent } from "@/components/ui/card";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Resources } from "@/enums/Resources";
import { formatBigNumber } from "@/lib/number";
import { resourceStore } from "@/store/resourceStore";

function Inventory() {
	const resources = resourceStore();

	return (
		<Card className="absolute bottom-0 left-0 w-full max-h-[30dvh] min-h-[20dvh] rounded-none overflow-scroll">
			<CardContent>
				<Tabs defaultValue="inventory">
					<TabsList>
						<TabsTrigger value="inventory">Inventory</TabsTrigger>
					</TabsList>

					<TabsContent value="inventory">
						<div className="flex gap-4">
							{resources.getAllResources().map((resource) => {
								return (
									<Tooltip key={resource.resource}>
										<TooltipTrigger>
											<ContextMenu>
												<ContextMenuTrigger
													disabled={resource.resource === Resources.Coins}
												>
													<div className="w-32 h-32 flex flex-col justify-center items-center bg-gray-100 rounded-lg">
														<IconMapper name={resource.resource} />
														<p className="font-bold mt-2">
															{formatBigNumber(resource.amount)}
														</p>
													</div>
												</ContextMenuTrigger>
												<ContextMenuContent>
													<ContextMenuSub>
														<ContextMenuSubTrigger>Sell</ContextMenuSubTrigger>
														<ContextMenuSubContent>
															<ContextMenuItem
																onClick={() => {
																	resources.sellResource(
																		resource.resource,
																		BigNumber(1),
																	);
																}}
															>
																Sell All
															</ContextMenuItem>
														</ContextMenuSubContent>
													</ContextMenuSub>
												</ContextMenuContent>
											</ContextMenu>
										</TooltipTrigger>
										<TooltipContent>
											<p>{resource.resource}</p>
										</TooltipContent>
									</Tooltip>
								);
							})}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

export default Inventory;
