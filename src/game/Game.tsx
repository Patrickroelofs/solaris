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
import { useCallback } from "react";
import { useGameLoop } from "@/hooks/useGameLoop.ts";
import { useFlowStore } from "@/store/flowStore";
import { playerStore } from "@/store/playerStore.ts";
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

	useGameLoop();

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
