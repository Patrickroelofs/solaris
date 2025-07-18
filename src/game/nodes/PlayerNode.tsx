"use client";

import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gameStore } from "@/store/gameStore";
import { resourceStore } from "@/store/resourceStore";

export default function PlayerNode() {
	const playerName = gameStore((state) => state.playerName);
	const changePlayerName = gameStore((state) => state.setPlayerName);

	const sellResources = resourceStore((state) => state.sellResources);
	const coinsResource = resourceStore((state) => state.coins);
	const woodResource = resourceStore((state) => state.wood);

	const resetGame = gameStore((state) => state.resetGame);

	return (
		<Tabs
			defaultValue="player"
			className="bg-white border-2 border-black rounded-lg p-2"
		>
			<TabsList className="w-full">
				<TabsTrigger value="player">Player</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
			</TabsList>
			<TabsContent value="player">
				<div className="px-4 py-2">
					<div className="flex flex-col items-center">
						<p className="font-bold text-2xl mb-4">{playerName}</p>
						<div className="text-sm">🪵 Wood: {woodResource}</div>
						<div className="text-sm">💰 Coins: {coinsResource}</div>
						<div className="flex gap-4 mt-6">
							<Button onClick={() => sellResources()}>Sell Resources</Button>
						</div>
					</div>
				</div>
			</TabsContent>
			<TabsContent value="settings">
				<div className="px-4 py-2 flex flex-col gap-2">
					<Label htmlFor="player-name">Player Name</Label>
					<Input
						id="player-name"
						type="text"
						value={playerName}
						onChange={(e) => {
							changePlayerName(e.target.value);
						}}
					/>

					<Label htmlFor="reset-game">Reset Game</Label>
					<Button
						id="reset-game"
						onClick={() => resetGame()}
						variant="destructive"
					>
						Destroy Save
					</Button>
				</div>
			</TabsContent>

			<Handle
				type="source"
				position={Position.Right}
				id="player-source"
				className="bg-blue-500"
			/>
		</Tabs>
	);
}
