import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	type Edge,
	type Node,
	type OnConnect,
	type OnEdgesChange,
	type OnNodesChange,
} from "@xyflow/react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FlowState = {
	edges: Edge[];
	nodes: Node[];
	setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
	setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
	onEdgesChange: OnEdgesChange;
	onNodesChange: OnNodesChange;
	onConnect: OnConnect;

	resetFlowStore: () => void;
};

const initialEdges: Edge[] = [];

const initialNodes: Node[] = [
	{
		id: "player",
		type: "playerNode",
		position: { x: 300, y: 150 },
		data: { Wood: [] },
		deletable: false,
	},
	{
		id: "Wood",
		type: "resourceNode",
		position: { x: 750, y: 50 },
		data: { label: "Wood" },
		deletable: false,
	},
];

export const useFlowStore = create<FlowState>()(
	persist(
		(set) => ({
			edges: initialEdges,
			nodes: initialNodes,

			setEdges: (edges) =>
				set((state) => ({
					edges:
						typeof edges === "function"
							? (edges as (edges: Edge[]) => Edge[])(state.edges)
							: edges,
				})),
			setNodes: (nodes) =>
				set((state) => ({
					nodes:
						typeof nodes === "function"
							? (nodes as (nodes: Node[]) => Node[])(state.nodes)
							: nodes,
				})),

			onEdgesChange: (changes) =>
				set((state) => ({
					edges: applyEdgeChanges(changes, state.edges),
				})),

			onNodesChange: (changes) =>
				set((state) => ({
					nodes: applyNodeChanges(changes, state.nodes),
				})),

			onConnect: (connection) =>
				set((state) => ({
					edges: addEdge(connection, state.edges),
				})),

			resetFlowStore: () => {
				set({
					edges: initialEdges,
					nodes: initialNodes,
				});
			},
		}),
		{
			name: "flow-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
