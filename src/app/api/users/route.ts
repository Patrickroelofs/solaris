import { payload } from "@/src/lib/getPayloadConfig";

export async function GET() {
	const users = await payload.find({
		collection: "users",
	});

	return Response.json({ users });
}
