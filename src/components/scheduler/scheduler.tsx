"use client";

import { useQuery } from "@tanstack/react-query";
import { format, getISOWeek } from "date-fns";
import { useRef, useState } from "react";
import type { Task, User } from "@/src/payload-types.js";
import SchedulerHeader from "./elements/schedulerHeader.js";
import SchedulerSidebar from "./elements/schedulerSidebar.js";

const formatDate = (date: Date, formatStr: string) => {
	return format(date, formatStr);
};

const isToday = (date: Date) => {
	return format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
};

const addDays = (date: Date, days: number) => {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

const startOfWeek = (date: Date) => {
	const result = new Date(date);
	const day = result.getDay();
	const diff = result.getDate() - day;
	result.setDate(diff);
	return result;
};

const weekNumber = (date: Date) => {
	return getISOWeek(date);
};

export default function SchedulingTool() {
	const { data: taskData } = useQuery({
		queryKey: ["tasks"],
		queryFn: async () => {
			const res = await fetch("/api/tasks");
			const data = await res.json();

			return data.tasks as Task[];
		},
	});

	const { data: userData } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await fetch("/api/users");
			const data = await res.json();

			return data.users as User[];
		},
	});

	const [tasks, _setTasks] = useState<Task[]>(taskData || []);

	const [currentWeekStart, setCurrentWeekStart] = useState(
		startOfWeek(new Date()),
	);

	const scrollRef = useRef<HTMLDivElement>(null);

	const generateWeekDays = (startDate: Date) => {
		const days = [];
		const monday = addDays(startOfWeek(startDate), 1);
		for (let i = 0; i < 7; i++) {
			days.push(addDays(monday, i));
		}
		return days;
	};

	const weekDays = generateWeekDays(currentWeekStart);

	const navigateWeek = (direction: "prev" | "next") => {
		const newDate = addDays(currentWeekStart, direction === "next" ? 7 : -7);
		setCurrentWeekStart(newDate);
	};

	const goToToday = () => {
		const today = startOfWeek(new Date());
		setCurrentWeekStart(today);
	};

	const getMonthYear = () => {
		const endDate = addDays(currentWeekStart, 6);

		if (currentWeekStart.getMonth() === endDate.getMonth()) {
			return format(currentWeekStart, "MMMM yyyy");
		} else {
			return `${format(currentWeekStart, "MMM")} - ${format(endDate, "MMM yyyy")}`;
		}
	};

	return (
		<div>
			<SchedulerHeader
				currentWeekStart={currentWeekStart}
				navigateWeek={navigateWeek}
				goToToday={goToToday}
				getMonthYear={getMonthYear}
				weekNumber={weekNumber}
			/>

			<div className="flex">
				<SchedulerSidebar users={userData} />

				<div className="flex-1 flex flex-col overflow-hidden">
					<div className="flex-1 overflow-x-auto" ref={scrollRef}>
						<div className="border-b sticky top-0 z-10 min-h-24 flex">
							{weekDays.map((day) => (
								<div
									key={day.toISOString()}
									className="min-w-36 w-1/7 p-3 text-center border-r last:border-r-0 flex-shrink-0 transition-colors"
								>
									<div className="text-sm font-medium">
										{formatDate(day, "EEE")} {formatDate(day, "d")}
									</div>
									<div className="text-xs mt-1">{formatDate(day, "MMM")}</div>
									{isToday(day) && (
										<div className="text-xs font-semibold mt-1">Today</div>
									)}
								</div>
							))}
						</div>

						<div className="flex">
							{weekDays.map((day) => (
								<div
									key={day.getDay()}
									className={`w-1/7 border-r last:border-r-0 flex-shrink-0`}
								>
									{userData ? (
										userData.map((user) => {
											const userTasks = tasks.filter((task) => {
												return (
													(task.createdBy as User).id === user.id &&
													format(new Date(task.date), "yyyy-MM-dd") ===
														format(day, "yyyy-MM-dd")
												);
											});

											return (
												<div
													key={user.id}
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
