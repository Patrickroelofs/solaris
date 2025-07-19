"use client";

import { Position } from "@xyflow/react";
import { IconMapper } from "@/components/icon-mapper";
import type { ResourcesType } from "@/enums/Resources";
import CustomHandle from "@/handles/CustomHandle.tsx";

export default function ResourceNode({
	data,
}: {
	data: { resource: ResourcesType };
}) {
	return (
		<div
			className={
				"relative px-4 py-2 shadow-md rounded-md border-2 bg-gray-200 border-gray-400"
			}
		>
			<div className="flex flex-col gap-2 justify-center items-center">
				<IconMapper name={data.resource} />
				<span className="font-medium text-xl">{data.resource}</span>
			</div>
			<CustomHandle
				connectionCount={1}
				type="target"
				position={Position.Left}
				id="resource-target"
			/>
		</div>
	);
}
