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
import BigNumber from "bignumber.js";
import { useCallback, useEffect } from "react";
import { Resources } from "@/enums/Resources";
import { useFlowStore } from "@/store/flowStore";
import { playerStore } from "@/store/playerStore.ts";
import { resourceStore } from "@/store/resourceStore";
import { upgradeStore } from "@/store/upgradeStore";
import Inventory from "./Inventory";
import PlayerNode from "./nodes/PlayerNode";
import ResourceNode from "./nodes/ResourceNode";

const nodeTypes = {
	playerNode: PlayerNode,
	resourceNode: ResourceNode,
};

function Flow() {
	const animationRef = useRef<number>()
  	const lastFrameTime = useRef<number>(0)
	const { edges, setEdges, nodes, onEdgesChange, onNodesChange } =
		useFlowStore();

	const player = playerStore();
	const upgrades = upgradeStore();

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

	const gameLoop = useCallback((currentTime: number) => {
const deltaTime = (currentTime - lastFrameTime.current) / 1000
    lastFrameTime.current = currentTime

    if (deltaTime > 0 && deltaTime < 1) {
		console.log("handle gameloop")
    }

    animationRef.current = requestAnimationFrame(gameLoop)
	}, [])

	useEffect(() => {
    	lastFrameTime.current = performance.now()
    	animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameLoop])


	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		const actionMultiplier = upgrades
	// 			.getAllUpgrades()
	// 			.reduce(
	// 				(acc, upgrade) =>
	// 					upgrade.unlocked
	// 						? player.currentAction === upgrade.resource
	// 							? acc * upgrade.multiplier
	// 							: acc
	// 						: acc,
	// 				1,
	// 			);

	// 		if (player.currentAction) {
	// 			addResource(
	// 				Resources[player.currentAction],
	// 				BigNumber(actionMultiplier),
	// 			);
	// 		}
	// 	}, 1000);

	// 	return () => clearInterval(interval);
	// }, [addResource, player.currentAction, upgrades.getAllUpgrades]);

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
