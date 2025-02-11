const schema = {
	name: {
		label: 'Name',
		type: 'string',
		isRequired: true,
		default: true,
		displayInTable: true,
		sort: true,
	},
	category: {
		label: 'Category',
		type: 'string',
		displayInTable: true,
		default: true,
	},
	clientName: {
		label: 'Client Name',
		type: 'string',
		displayInTable: true,
	},
	devUrl: {
		label: 'Dev Url',
		type: 'string',
	},
	liveUrl: {
		label: 'Live Url',
		type: 'string',
	},
	testUrl: {
		label: 'Test Url',
		type: 'string',
	},
	prodUrl: {
		label: 'Prod Url',
		type: 'string',
	},
	projectType: {
		label: 'Project Type',
		type: 'select',
		options: [
			{
				label: 'Frontend',
				value: 'frontend',
			},
			{
				label: 'Backend',
				value: 'backend',
			},
			{
				label: 'Fullstack',
				value: 'fullstack',
			},
			{
				label: 'Android',
				value: 'android',
			},
			{
				label: 'IOS',
				value: 'ios',
			},
			{
				label: 'Admin',
				value: 'admin',
			},
			{
				label: 'Other',
				value: 'other',
			},
		],
	},
	status: {
		label: 'Status',
		type: 'select',
		options: [
			{
				label: 'New',
				value: 'new',
			},
			{
				label: 'In Progress',
				value: 'in-progress',
			},
			{
				label: 'Completed',
				value: 'completed',
			},
			{
				label: 'Cancelled',
				value: 'cancelled',
			},
			{
				label: 'On Hold',
				value: 'on-hold',
			},
			{
				label: 'Testing',
				value: 'testing',
			},
			{
				label: 'Deployed',
				value: 'deployed',
			},
			{
				label: 'Pending',
				value: 'pending',
			},
		],
	},
	technologies: {
		label: 'Technologies',
		type: 'tag',
	},
	frameworks: {
		label: 'frameworks',
		type: 'tag',
	},
	libraries: {
		label: 'Libraries',
		type: 'tag',
	},
	githubUrl: {
		label: 'Github Url',
		type: 'string',
	},
	createdAt: {
		label: 'Created At',
		type: 'string',
	},
	updatedAt: {
		label: 'Updated At',
		type: 'string',
	},
};

export default schema;
