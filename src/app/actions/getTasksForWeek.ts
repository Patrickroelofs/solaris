"use server";

import { endOfWeek, setWeek, startOfWeek } from "date-fns";
import { getPayload } from "payload";
import config from "@/src/payload.config";

interface GetTasksForWeekArgs {
	selectedYearNumber: number;
	selectedWeekNumber: number;
	scheduleId: number;
}

export async function getTasksForWeek({
	selectedYearNumber,
	selectedWeekNumber,
	scheduleId,
}: GetTasksForWeekArgs) {
	const { start, end } = getWeekRange(selectedYearNumber, selectedWeekNumber);

	const payload = await getPayload({
		config,
	});

	const tasks = await payload.find({
		collection: "tasks",
		pagination: false,
		where: {
			and: [
				{
					date: {
						greater_than_equal: start,
					},
				},
				{
					date: {
						less_than_equal: end,
					},
				},
				{
					schedule: {
						equals: scheduleId,
					},
				},
			],
		},
		select: {
			title: true,
			date: true,
			createdBy: true,
			duration: true,
		},
		populate: {
			people: {
				name: true,
			},
		},
	});

	return tasks.docs;
}

function getWeekRange(year: number, week: number, weekStartsOn: 0 | 1 = 1) {
	const date = new Date(year, 0, 1);

	const dateWithWeek = setWeek(date, week, { weekStartsOn });

	const start = startOfWeek(dateWithWeek, { weekStartsOn });
	const end = endOfWeek(dateWithWeek, { weekStartsOn });

	return { start, end };
}
