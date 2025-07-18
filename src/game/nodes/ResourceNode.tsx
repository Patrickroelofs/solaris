import { Handle, Position } from "reactflow";

export default function ResourceNode({
	data,
}: {
	data: { label: string; unlocked: boolean };
}) {
	return (
		<div
			className={
				"px-4 py-2 shadow-md rounded-md border-2 bg-gray-200 border-gray-400"
			}
		>
			<div className="text-lg font-bold">{data.label}</div>
			<Handle
				type="target"
				position={Position.Left}
				id="resource-target"
				isConnectable={data.unlocked}
			/>
		</div>
	);
}
