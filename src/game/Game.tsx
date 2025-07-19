"use client";

import {
	addEdge,
	Background,
	type Connection,
	type Edge,
	ReactFlow,
	ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";
import { Resources } from "@/enums/Resources";
import { useFlowStore } from "@/store/flowStore";
import { playerStore } from "@/store/playerStore.ts";
import { resourceStore } from "@/store/resourceStore";
import Inventory from "./Inventory";
import PlayerNode from "./nodes/PlayerNode";
import ResourceNode from "./nodes/ResourceNode";

const nodeTypes = {
	playerNode: PlayerNode,
	resourceNode: ResourceNode,
};

function Flow() {
	const { edges, setEdges, nodes, onEdgesChange, onNodesChange } =
		useFlowStore();

	const player = playerStore();

	const addResource = resourceStore((state) => state.addResource);

	const onConnect = useCallback(
		(params: Edge | Connection) => {
			const targetNode = nodes.find((node) => node.id === params.target);

			if (targetNode?.data?.resource) {
				player.setCurrentAction(targetNode.data.resource);
			}

			setEdges((eds) => {
				return addEdge(params, eds);
			});
		},
		[setEdges, nodes, player.setCurrentAction],
	);

	const onEdgesDelete = useCallback(
		(deletedEdges: Edge[]) => {
			setEdges((eds) =>
				eds.filter((e) => {
					if (e.source === "player") {
						player.setCurrentAction(undefined);
					}

					return !deletedEdges.some((de) => de.id === e.id);
				}),
			);
		},
		[setEdges, player.setCurrentAction],
	);

	useEffect(() => {
		const interval = setInterval(() => {
			if (player.currentAction) {
				addResource(Resources[player.currentAction], "1");
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [addResource, player.currentAction]);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			onEdgesDelete={onEdgesDelete}
			nodeTypes={nodeTypes}
			fitView
		>
			<Background gap={12} size={1} />
		</ReactFlow>
	);
}

function Game() {
	return (
		<div className="w-screen h-screen">
			<ReactFlowProvider>
				<Flow />
				<Inventory />
			</ReactFlowProvider>
		</div>
	);
}

export { Game };
