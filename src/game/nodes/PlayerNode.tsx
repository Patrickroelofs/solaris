"use client";

import { Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gameStore } from "@/store/gameStore";

export default function PlayerNode() {
	const playerName = gameStore((state) => state.playerName);
	const changePlayerName = gameStore((state) => state.setPlayerName);

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
						onClick={() => gameStore.getState().resetGame()}
						variant="destructive"
					>
						Destroy Save
					</Button>
				</div>
			</TabsContent>

			<Handle type="source" position={Position.Right} id="player-source" />
		</Tabs>
	);
}
