import flowData from "./initial/flow-store.json";
import { edgesSchema, nodesSchema } from "./schema/flowSchema";

function validateInitialData(): void {
	try {
		const edges = edgesSchema.parse(flowData.edges);
		const nodes = nodesSchema.parse(flowData.nodes);
	} catch (error) {
		console.error("Error validating initial data:", error);
	}
}
