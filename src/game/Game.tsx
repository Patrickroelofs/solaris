"use client";

import ReactFlow, {
	addEdge,
	Background,
	type Connection,
	Controls,
	type Edge,
	MarkerType,
	MiniMap,
	type Node,
	ReactFlowProvider,
	useEdgesState,
	useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useEffect } from "react";
import { AnimatedSvgEdge } from "@/components/animated-svg-edge";
import { resourceStore } from "@/store/resourceStore";
import PlayerNode from "./nodes/PlayerNode";
import ResourceNode from "./nodes/ResourceNode";

const nodeTypes = {
	playerNode: PlayerNode,
	resourceNode: ResourceNode,
};

const edgeTypes = {
	animatedSvgEdge: AnimatedSvgEdge,
};

const initialNodes: Node[] = [
	{
		id: "player",
		type: "playerNode",
		position: { x: 300, y: 150 },
		data: { wood: 0 },
	},
	{
		id: "wood",
		type: "resourceNode",
		position: { x: 750, y: 50 },
		data: { label: "Wood" },
	},
];

const initialEdges: Edge[] = [];

function Game() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
				addWoodResource(1);
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
				attributionPosition="bottom-left"
			>
				<MiniMap />
				<Controls />
				<Background gap={12} size={1} />
			</ReactFlow>
		</ReactFlowProvider>
	);
}

export { Game };
