"use server";

import { getPayload } from "payload";
import config from "@/src/payload.config";

interface DeleteTaskArgs {
	id: number;
}

export async function deleteTaskAction(args: DeleteTaskArgs) {
	const payload = await getPayload({
		config,
	});

	const task = await payload.delete({
		collection: "tasks",
		id: args.id,
	});

	return task;
}
