"use client";

import { Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomHandle from "@/handles/CustomHandle.tsx";
import { gameStore } from "@/store/gameStore";
import { playerStore } from "@/store/playerStore.ts";
import { upgradeStore } from "@/store/upgradeStore";
import { formatBigNumber } from "@/lib/number";

export default function PlayerNode() {
	const playerName = playerStore((state) => state.playerName);
	const changePlayerName = playerStore((state) => state.setPlayerName);
	const upgrades = upgradeStore();

	return (
		<Tabs
			defaultValue="player"
			className="bg-white border-2 border-black rounded-lg p-2"
		>
			<TabsList className="w-full">
				<TabsTrigger value="player">Player</TabsTrigger>
				<TabsTrigger value="upgrades">Upgrades</TabsTrigger>
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
			<TabsContent value="upgrades">
				<div className="flex gap-4 flex-col">
					{upgrades.getAllUpgrades().map((upgrade) => {
						return (
							<Button
								key={upgrade.id}
								disabled={upgrade.unlocked}
								onClick={() => {
									upgrades.buyUpgrade(upgrade.id, upgrade.resource);
								}}
								className="flex flex-col h-auto"
							>
								<span>{upgrade.name}</span>
								<span className="text-sm text-gray-300">
									Cost: {formatBigNumber(upgrade.cost)} {upgrade.resource}
								</span>
							</Button>
						);
					})}
				</div>
			</TabsContent>

			<CustomHandle
				connectioncount={1}
				type="source"
				position={Position.Right}
				id="player-source"
			/>
		</Tabs>
	);
}
