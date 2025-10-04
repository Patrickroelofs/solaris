import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { getSchedule } from "@/src/app/actions/getSchedule";
import SchedulingTool from "@/src/components/scheduler/scheduler";

interface SchedulePageProps {
	params: { schedule: string };
}

export default async function SchedulePage({ params }: SchedulePageProps) {
	const { schedule } = await params;

	if (!schedule) {
		throw new Error("No schedule ID provided");
	}

	if (Number.isNaN(Number(schedule))) {
		throw new Error("Invalid schedule ID");
	}

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["schedule", Number(schedule)],
		queryFn: async () => {
			const data = await getSchedule(Number(schedule));

			return data;
		},
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SchedulingTool scheduleId={Number(schedule)} getSchedule={getSchedule} />
		</HydrationBoundary>
	);
}
