import type { CollectionConfig } from "payload";

export const Tasks: CollectionConfig = {
	slug: "tasks",
	admin: {
		group: "Management",
	},
	fields: [
		{
			name: "createdBy",
			type: "relationship",
			relationTo: "users",
			admin: {
				disableBulkEdit: true,
				readOnly: true,
			},
			hooks: {
				beforeChange: [
					async ({ req, data }) => {
						if (req.user) {
							return req.user.id;
						}
						return data;
					},
				],
			},
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
		},
		{
			name: "color",
			type: "text",
			required: true,
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
	],
};
