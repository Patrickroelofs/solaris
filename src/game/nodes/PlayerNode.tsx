"use client";

import { Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomHandle from "@/handles/CustomHandle.tsx";
import { gameStore } from "@/store/gameStore";
import { playerStore } from "@/store/playerStore.ts";

export default function PlayerNode() {
	const playerName = playerStore((state) => state.playerName);
	const changePlayerName = playerStore((state) => state.setPlayerName);

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

			<CustomHandle
				connectionCount={1}
				type="source"
				position={Position.Right}
				id="player-source"
			/>
		</Tabs>
	);
}
