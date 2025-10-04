"use server";

import { getPayload } from "payload";
import config from "@/src/payload.config";

export async function getSchedule(id: number) {
	const payload = await getPayload({
		config,
	});

	const schedule = await payload.findByID({
		collection: "schedules",
		id: id,
		joins: false,
		populate: {
			people: {
				name: true,
			},
		},
	});

	return schedule;
}
