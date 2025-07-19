"use client";

import { Handle, Position, useNodes } from "@xyflow/react";
import { useState } from "react";
import { IconMapper } from "@/components/icon-mapper";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { ResourcesType } from "@/enums/Resources";
import { useFlowStore } from "@/store/flowStore.ts";

export default function ResourceNode({
	id,
	data,
}: {
	id: string;
	data: { label: ResourcesType; unlocked: boolean };
}) {
	const nodes = useNodes();
	const node = nodes.find((n) => n.id === id);
	const flowStore = useFlowStore();

	const [isDialogOpen, setIsDialogOpen] = useState(
		!node?.data.resourceSelected,
	);

	const handleClick = () => {
		if (node) {
			flowStore.setNodes((nodes) =>
				nodes.map((n) =>
					n.id === id
						? {
								...n,
								data: {
									...n.data,
									label: "Wood",
									resourceSelected: true,
								},
							}
						: n,
				),
			);

			setIsDialogOpen(false);
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<div className="relative">
				<DialogContent className="z-50">
					<Button onClick={handleClick}>Wood</Button>
				</DialogContent>
				<div
					className={
						"px-4 py-2 shadow-md rounded-md border-2 bg-gray-200 border-gray-400"
					}
				>
					<div className="flex flex-col gap-2 justify-center items-center">
						<IconMapper name={data.label} />
						<span className="font-medium text-xl">{data.label}</span>
					</div>
					<Handle
						type="target"
						position={Position.Left}
						id="resource-target"
						isConnectable={data.unlocked}
					/>
				</div>
			</div>
		</Dialog>
	);
}
