import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import SchedulingTool from "@/src/components/scheduler/scheduler";
import { payload } from "@/src/lib/getPayloadConfig";

export default async function HomePage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["tasks"],
		queryFn: async () => {
			const data = await payload.find({
				collection: "tasks",
			});

			return data.docs;
		},
	});

	await queryClient.prefetchQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const data = await payload.find({
				collection: "users",
			});

			return data.docs;
		},
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SchedulingTool />
		</HydrationBoundary>
	);
}
