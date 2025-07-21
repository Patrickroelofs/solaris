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
import { Resources, type ResourcesType } from "@/enums/Resources.tsx";

type FlowState = {
	edges: Edge<EdgeData>[];
	nodes: Node<NodeData>[];
	setEdges: (
		edges: Edge<EdgeData>[] | ((edges: Edge<EdgeData>[]) => Edge<EdgeData>[]),
	) => void;
	setNodes: (
		nodes: Node<NodeData>[] | ((nodes: Node<NodeData>[]) => Node<NodeData>[]),
	) => void;
	onEdgesChange: OnEdgesChange;
	onNodesChange: OnNodesChange;
	onConnect: OnConnect;

	resetFlowStore: () => void;
};

// biome-ignore lint/complexity/noBannedTypes: This will be filled with data later
export type EdgeData = {};

const initialEdges: Edge<EdgeData>[] = [];

export type NodeData = {
	resource?: ResourcesType;
};

const initialNodes: Node<NodeData>[] = [
	{
		id: "player",
		type: "playerNode",
		position: { x: 300, y: 150 },
		data: {},
		deletable: false,
	},
	{
		id: "wood",
		type: "resourceNode",
		position: { x: 750, y: 50 },
		data: { resource: Resources.Wood },
		deletable: false,
	},
	{
		id: "stone",
		type: "resourceNode",
		position: { x: 750, y: 250 },
		data: { resource: Resources.Stone },
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
