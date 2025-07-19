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

	return (
		<Card className="absolute bottom-0 left-0 w-full max-h-[30dvh] rounded-none overflow-scroll">
			<CardHeader>
				<CardTitle className="text-3xl mb-4">Inventory</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex gap-4">
					{allResources.map((resource) => {
						return (
							<Tooltip key={resource.label}>
								<TooltipTrigger>
									<ContextMenu>
										<ContextMenuTrigger
											disabled={resource.label === Resources.Coins}
										>
											<div className="w-32 h-32 flex flex-col justify-center items-center bg-gray-100 rounded-lg">
												<IconMapper name={resource.label} />
												<p className="font-bold mt-2">{resource.value.short}</p>
											</div>
										</ContextMenuTrigger>
										<ContextMenuContent>
											<ContextMenuSub>
												<ContextMenuSubTrigger>Sell</ContextMenuSubTrigger>
												<ContextMenuSubContent>
													<ContextMenuItem
														onClick={() => {
															resources.sellResource(resource.label, "all");
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
