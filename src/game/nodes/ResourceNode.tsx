"use client";

import { Handle, Position } from "@xyflow/react";
import { IconMapper } from "@/components/icon-mapper";
import type { ResourcesType } from "@/enums/Resources";

export default function ResourceNode({
	data,
}: {
	data: { label: ResourcesType; unlocked: boolean };
}) {
	return (
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
	);
}
