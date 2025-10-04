"use server";

import { getPayload } from "payload";
import config from "@/src/payload.config";

interface SubmitNewTaskArgs {
	title: string;
	duration: number;
	date: string;
	scheduleId: number;
	createdBy: number;
}

export async function submitNewTask(args: SubmitNewTaskArgs) {
	console.log(args);
	const payload = await getPayload({
		config,
	});

	const task = await payload.create({
		collection: "tasks",
		data: {
			title: args.title,
			duration: args.duration,
			date: args.date,
			schedule: args.scheduleId,
			createdBy: args.createdBy,
		},
	});

	return task;
}
