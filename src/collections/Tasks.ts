import type { CollectionConfig } from "payload";

export const Tasks: CollectionConfig = {
	slug: "tasks",
	admin: {
		group: "Management",
	},
	access: {
		read: () => true,
	},
	fields: [
		{
			name: "createdBy",
			type: "relationship",
			relationTo: "people",
		},
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			required: true,
			min: 0.5,
		},
		{
			name: "date",
			type: "date",
			required: true,
			admin: {
				date: {
					pickerAppearance: "dayOnly",
				},
			},
		},
		{
			name: "schedule",
			type: "relationship",
			relationTo: "schedules",
			required: true,
		},
	],
};
