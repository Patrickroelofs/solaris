"use client";

import { useQuery } from "@tanstack/react-query";
import { format, getISOWeek, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import { getTasksForWeek } from "@/src/app/actions/getTasksForWeek.js";
import type { Person, Schedule } from "@/src/payload-types.js";
import SchedulerHeader from "./elements/schedulerHeader.js";
import SchedulerSidebar from "./elements/schedulerSidebar.js";

const formatDate = (date: Date, formatStr: string) => {
	return format(date, formatStr);
};

const weekNumber = (date: Date) => {
	return getISOWeek(date);
};

const weekDays = (weekNum: number, year: number) => {
	const firstDayOfWeek = startOfWeek(new Date(year, 0, 1 + (weekNum - 1) * 7), {
		weekStartsOn: 1,
	});

	return Array.from(
		{ length: 7 },
		(_, i) => new Date(firstDayOfWeek.getTime() + i * 24 * 60 * 60 * 1000),
	);
};

interface SchedulingToolProps {
	getSchedule: (id: number) => Promise<Schedule>;
	scheduleId: number;
}

export default function SchedulingTool({
	getSchedule,
	scheduleId,
}: SchedulingToolProps) {
	const [selectedYearNumber, setSelectedYearNumber] = useState(
		new Date().getFullYear(),
	);

	const [selectedWeekNumber, setSelectedWeekNumber] = useState(
		weekNumber(new Date()),
	);

	const [currentWeekDays, setCurrentWeekDays] = useState(
		weekDays(selectedWeekNumber, new Date().getFullYear()),
	);

	useEffect(() => {
		setCurrentWeekDays(weekDays(selectedWeekNumber, new Date().getFullYear()));
	}, [selectedWeekNumber]);

	const { data: scheduleData } = useQuery({
		queryKey: ["schedule", scheduleId],
		queryFn: async () => {
			const data = await getSchedule(scheduleId);

			return data;
		},
	});

	const { data: taskData } = useQuery({
		queryKey: ["tasks", selectedWeekNumber],
		queryFn: async () => {
			const tasks = await getTasksForWeek({
				selectedYearNumber: selectedYearNumber,
				selectedWeekNumber: selectedWeekNumber,
				scheduleId: scheduleId,
			});

			return tasks;
		},
	});

	const goToToday = () => {
		setSelectedWeekNumber(weekNumber(new Date()));
	};

	return (
		<div>
			<SchedulerHeader
				setSelectedWeekNumber={setSelectedWeekNumber}
				setSelectedYearNumber={setSelectedYearNumber}
				selectedWeekNumber={selectedWeekNumber}
				selectedYearNumber={selectedYearNumber}
				goToToday={goToToday}
			/>

			<div className="flex">
				<SchedulerSidebar people={scheduleData?.people} />

				<div className="flex-1 flex flex-col overflow-hidden">
					<div className="flex-1 overflow-x-auto">
						<div className="border-b sticky top-0 z-10 min-h-24 flex">
							{currentWeekDays.map((day) => (
								<div
									key={day.toISOString()}
									className="min-w-36 w-1/7 p-3 text-center border-r last:border-r-0 flex-shrink-0 transition-colors"
								>
									<div className="text-sm font-medium">
										{formatDate(day, "EEE")} {formatDate(day, "d")}
									</div>
									<div className="text-xs mt-1">{formatDate(day, "MMM")}</div>
								</div>
							))}
						</div>

						<div className="flex">
							{currentWeekDays.map((day) => (
								<div
									key={day.getDay()}
									className={`w-1/7 border-r last:border-r-0 flex-shrink-0`}
								>
									{scheduleData && taskData ? (
										scheduleData.people?.map((person) => {
											if (typeof person === "number") {
												throw new Error(
													"Person is a number, expected Person object",
												);
											}

											const userTasks = taskData.filter((task) => {
												return (
													(task.createdBy as Person).id === person.id &&
													format(new Date(task.date), "yyyy-MM-dd") ===
														format(day, "yyyy-MM-dd")
												);
											});

											return (
												<div
													key={person.id}
													className={`h-32 border-b p-2 relative transition-all duration-200`}
												>
													{userTasks.map((task) => {
														const taskHeight = (task.duration / 8) * 100;

														return (
															<div
																key={task.id}
																className="bg-blue-500 rounded-lg text-white text-xs p-2"
																style={{
																	height: `${taskHeight}%`,
																}}
															>
																<div className="font-medium leading-tight overflow-hidden">
																	<div className="truncate text-xs">
																		{task.title}
																	</div>
																	<span>{task.duration}h</span>
																</div>
															</div>
														);
													})}
												</div>
											);
										})
									) : (
										// TODO: Properly handling loading
										<div className="p-2">Loading...</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
