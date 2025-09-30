import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { getISOWeek } from "date-fns/getISOWeek";
import SchedulingTool from "@/src/components/scheduler/scheduler";
import { payload } from "@/src/lib/getPayloadConfig";
import type { Task } from "@/src/payload-types";

export default async function HomePage() {
	const queryClient = new QueryClient();

	const weekNumber = () => {
		return getISOWeek(new Date());
	};

	await queryClient.prefetchQuery({
		queryKey: ["tasks", weekNumber()],
		queryFn: async () => {
			const res = await fetch(
				`/api/scheduler-tasks?weekNumber=${weekNumber()}&year=${new Date().getFullYear()}`,
			);
			const data = await res.json();

			return data.tasks as Task[];
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
