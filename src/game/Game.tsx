"use client";

import ReactFlow, {
	addEdge,
	Background,
	type Connection,
	type Edge,
	MarkerType,
	ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useEffect } from "react";
import { AnimatedSvgEdge } from "@/components/animated-svg-edge";
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

	const addWoodResource = resourceStore((state) => state.addWood);

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
							const updatedData = {
								...node.data,
								choppingWood: false,
							};

							if (params.target === "wood") {
								updatedData.choppingWood = true;
							}

							return { ...node, data: updatedData };
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
			const isPlayerEdgeDeleted = deletedEdges.some(
				(edge) => edge.source === "player" && edge.target === "wood",
			);

			if (isPlayerEdgeDeleted) {
				setNodes((nds) =>
					nds.map((node) => {
						if (node.deletable === false) return node;
						if (node.id === "player") {
							return {
								...node,
								data: {
									...node.data,
									choppingWood: false,
								},
							};
						}
						return node;
					}),
				);
			}
		},
		[setNodes],
	);

	useEffect(() => {
		const interval = setInterval(() => {
			const playerNode = nodes.find((node) => node.id === "player");
			if (playerNode?.data.choppingWood) {
				addWoodResource();
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [nodes, addWoodResource]);

	return (
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
	);
}

export { Game };
