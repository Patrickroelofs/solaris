"use client";

import { Handle, Position } from "reactflow";
import { gameStore } from "@/store/gameStore";
import { resourceStore } from "@/store/resourceStore";

export default function PlayerNode() {
	const playerName = gameStore((state) => state.playerName);
	const changePlayerName = gameStore((state) => state.setPlayerName);

	const sellResources = resourceStore((state) => state.sellResources);
	const coinsResource = resourceStore((state) => state.coins);
	const woodResource = resourceStore((state) => state.wood);

	return (
		<div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 min-w-[180px]">
			<div className="flex flex-col items-center">
				<input
					type="text"
					className="text-lg font-bold"
					value={playerName}
					onChange={(e) => {
						changePlayerName(e.target.value);
					}}
				/>
				<div className="text-sm text-gray-600 mt-2">Resources:</div>
				<div className="text-sm">🪵 Wood: {woodResource}</div>
				<div className="text-sm">💰 Coins: {coinsResource}</div>
				<button
					type="button"
					onClick={() => sellResources()}
					className="mt-2 border-2 border-gray-800 rounded-md px-2 text-gray-800"
				>
					Sell Resources
				</button>
			</div>
			<Handle type="source" position={Position.Right} id="player-source" />
		</div>
	);
}
