import { useEffect, useRef } from "react";
import { Resources } from "@/enums/Resources.tsx";
import { playerStore } from "@/store/playerStore.ts";
import { resourceStore } from "@/store/resourceStore.ts";

export function useGameLoop() {
	const player = playerStore();
	const resources = resourceStore();

	const lastTimeRef = useRef(0);
	const animationFrameRef = useRef(0);

	useEffect(() => {
		const gameLoop = (currentTime: number) => {
			if (lastTimeRef.current === 0) {
				lastTimeRef.current = currentTime;
			}

			const deltaTime = currentTime - lastTimeRef.current;

			const cappedDeltaTime = Math.min(deltaTime, 100);

			if (cappedDeltaTime > 0) {
				if (player.currentAction) {
					resources.addResource(
						Resources[player.currentAction],
						cappedDeltaTime,
					);
				}
			}

			lastTimeRef.current = currentTime;
			animationFrameRef.current = requestAnimationFrame(gameLoop);
		};

		animationFrameRef.current = requestAnimationFrame(gameLoop);
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [player.currentAction]);
}
