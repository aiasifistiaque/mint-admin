// Mirrors the backend's contentConfig (backend/models/content/config.ts) — the
// schema itself is fetched from the server, so only the field selection and the
// form layout live here.

export const fields = [
	'name',
	'title',
	'slug',
	'contentType',
	'status',
	'content.data',
	'tags',
	'isActive',
	'createdAt',
];

export const formFields = [
	{
		sectionTitle: 'Content Details',
		fields: ['name', 'title', ['slug', 'contentType'], 'status'],
	},
	{
		sectionTitle: 'Data',
		fields: ['content.data'],
	},
	{
		sectionTitle: 'Additional Info',
		collapsible: true,
		fields: ['tags', 'isActive'],
	},
];

export const tableFields = ['name', 'contentType', 'status', 'slug', 'createdAt'];
