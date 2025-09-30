import {
	addDays,
	endOfWeek,
	setISOWeek,
	setWeek,
	setYear,
	startOfWeek,
} from "date-fns";
import type { NextRequest } from "next/server";
import { payload } from "@/src/lib/getPayloadConfig";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const week = searchParams.get("week");
	const year = searchParams.get("year") || new Date().getFullYear().toString();

	let whereClause = {};

	if (week) {
		const { start, end } = getWeekRange(parseInt(year, 10), parseInt(week, 10));

		whereClause = {
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
			],
		};
	}

	const tasks = await payload.find({
		collection: "tasks",
		where: whereClause,
	});

	return Response.json({ tasks, week, year });
}

function getWeekRange(year: number, week: number, weekStartsOn: 0 | 1 = 1) {
	const date = new Date(year, 0, 1);

	const dateWithWeek = setWeek(date, week, { weekStartsOn });

	const start = startOfWeek(dateWithWeek, { weekStartsOn });
	const end = endOfWeek(dateWithWeek, { weekStartsOn });

	return { start, end };
}
