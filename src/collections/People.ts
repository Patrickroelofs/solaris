import type { CollectionConfig } from "payload";

export const People: CollectionConfig = {
	slug: "people",
	admin: {
		useAsTitle: "name",
		group: "Management",
	},
	access: {
		read: () => true,
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			name: "relatedSchedules",
			type: "join",
			collection: "schedules",
			on: "people",
		},
	],
};
