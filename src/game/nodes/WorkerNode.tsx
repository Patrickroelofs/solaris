"use client";

import { Position } from "@xyflow/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomHandle from "@/handles/CustomHandle.tsx";

export default function WorkerNode() {
	return (
		<Tabs
			defaultValue="worker"
			className="bg-white border-2 border-black rounded-lg p-2"
		>
			<TabsList className="w-full">
				<TabsTrigger value="worker">Worker</TabsTrigger>
			</TabsList>
			<TabsContent value="worker">
				<div className="px-4 py-2">
					<div className="flex flex-col items-center">
						<p className="font-bold text-2xl mb-4">Worker Node</p>
					</div>
				</div>
			</TabsContent>

			<CustomHandle
				connectioncount={1}
				type="source"
				position={Position.Right}
				id="worker-source"
			/>
		</Tabs>
	);
}
