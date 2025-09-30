import { payload } from "@/src/lib/getPayloadConfig";

export async function GET() {
	const tasks = await payload.find({
		collection: "tasks",
	});

	return Response.json({ tasks });
}
