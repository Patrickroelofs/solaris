"use client";

import {
	addEdge,
	Background,
	type Connection,
	type Edge,
	MarkerType,
	ReactFlow,
	ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";
import { AnimatedSvgEdge } from "@/components/animated-svg-edge";
import { Resources } from "@/enums/Resources";
import { useFlowStore } from "@/store/flowStore";
import { resourceStore } from "@/store/resourceStore";
import Inventory from "./Inventory";
import PlayerNode from "./nodes/PlayerNode";
import ResourceNode from "./nodes/ResourceNode";

const nodeTypes = {
	playerNode: PlayerNode,
	resourceNode: ResourceNode,
};

const edgeTypes = {
	animatedSvgEdge: AnimatedSvgEdge,
};

function Game() {
	const { edges, setEdges, nodes, setNodes, onEdgesChange, onNodesChange } =
		useFlowStore();

	const addResource = resourceStore((state) => state.addResource);

	const onConnect = useCallback(
		(params: Edge | Connection) => {
			const newEdge = {
				...params,
				type: "animatedSvgEdge",
				data: {
					duration: 1,
					shape: params.target,
					direction: "reverse",
				},
				markerEnd: { type: MarkerType.ArrowClosed },
			};

			if (params.source === "player") {
				setEdges((eds) => {
					const filteredEdges = eds.filter((edge) => edge.source !== "player");
					return addEdge(newEdge, filteredEdges);
				});

				setNodes((nds) =>
					nds.map((node) => {
						if (node.id === "player") {
							return {
								...node,
								data: {
									currentAction: params.target,
								},
							};
						}
						return node;
					}),
				);
			}
		},
		[setEdges, setNodes],
	);

	const onEdgesDelete = useCallback(
		(deletedEdges: Edge[]) => {
			setEdges((eds) =>
				eds.filter(
					(edge) => !deletedEdges.some((delEdge) => delEdge.id === edge.id),
				),
			);

			const isPlayerEdgeDeleted = deletedEdges.some(
				(edge) => edge.source === "player",
			);

			if (isPlayerEdgeDeleted) {
				setNodes((nds) =>
					nds.map((node) => {
						if (node.id === "player") {
							return {
								...node,
								data: {
									currentAction: null,
								},
							};
						}
						return node;
					}),
				);
			}
		},
		[setNodes, setEdges],
	);

	useEffect(() => {
		const interval = setInterval(() => {
			const playerNode = nodes.find((node) => node.id === "player");

			if (playerNode?.data.currentAction) {
				// TODO: Type the currentAction properly
				addResource(
					Resources[playerNode.data.currentAction as keyof typeof Resources],
					"1",
				);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [nodes, addResource]);

	return (
		<div className="w-screen h-screen">
			<ReactFlowProvider>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onEdgesDelete={onEdgesDelete}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					fitView
				>
					<Background gap={12} size={1} />
				</ReactFlow>
				<Inventory />
			</ReactFlowProvider>
		</div>
	);
}

export { Game };
