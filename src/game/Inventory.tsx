import { IconContext } from "@phosphor-icons/react";
import { gsap } from "gsap";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getResourceDetail } from "@/enums/Resources";
import { resourceStore } from "@/store/resourceStore";

function Inventory() {
	const resources = resourceStore();
	const allResources = resources.getAllResources();

	const cardRef = React.useRef<HTMLDivElement>(null);

	const hasResources = resources
		.getAllResources()
		.some((resource) => resource.value > 0);

	useEffect(() => {
		if (cardRef.current) {
			if (hasResources) {
				gsap.to(cardRef.current, {
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: "power2.out",
				});
			} else {
				gsap.to(cardRef.current, {
					opacity: 0,
					y: 100,
					duration: 0.3,
					ease: "power2.in",
				});
			}
		}
	}, [hasResources]);

	return (
		<Card
			className="absolute bottom-0 left-0 w-full h-[30dvh] rounded-none"
			ref={cardRef}
		>
			<CardHeader>
				<CardTitle className="text-3xl mb-4">Inventory</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex gap-4">
					{allResources.map((resource) => {
						if (resource.value <= 0) return null;

						return (
							<Tooltip key={getResourceDetail(resource.label)?.name}>
								<TooltipTrigger>
									<div className="w-32 h-32 flex flex-col justify-center items-center bg-gray-100 rounded-lg">
										<IconContext.Provider value={{ size: 48 }}>
											{getResourceDetail(resource.label)?.icon}
										</IconContext.Provider>
										<p className="font-bold mt-2">{resource.value}</p>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>{resource.label}</p>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

export default Inventory;
