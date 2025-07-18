import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { resourceStore } from "@/store/resourceStore";

export default function ResourceNode({
	data,
}: {
	data: { label: string; unlocked: boolean };
}) {
	const woodPerAction = resourceStore((state) => state.woodPerAction);
	const woodUpgradeCost = resourceStore((state) => state.woodUpgradeCost);
	const woodUpgradeLevel = resourceStore((state) => state.woodUpgradeLevel);
	const upgradeWoodPerAction = resourceStore(
		(state) => state.upgradeWoodPerAction,
	);

	return (
		<div
			className={
				"px-4 py-2 shadow-md rounded-md border-2 bg-gray-200 border-gray-400"
			}
		>
			<div className="flex flex-col gap-2">
				<span className="font-bold text-3xl">{data.label}</span>
				<span>Level: {woodUpgradeLevel}</span>
				<span>Cost: 💰{woodUpgradeCost}</span>
				<span>Wood Per Action: {woodPerAction}</span>

				<Button onClick={upgradeWoodPerAction}>Upgrade</Button>
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
