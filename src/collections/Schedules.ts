import type { CollectionConfig } from "payload";

export const Schedules: CollectionConfig = {
	slug: "schedules",
	admin: {
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
			name: "people",
			type: "relationship",
			relationTo: "people",
			hasMany: true,
		},
		{
			name: "relatedTasks",
			type: "join",
			collection: "tasks",
			on: "schedule",
		},
	],
};
