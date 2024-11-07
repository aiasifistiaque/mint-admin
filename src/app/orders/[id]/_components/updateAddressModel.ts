const updateAddressModel: any = [
	{
		name: 'address.name',
		label: 'Recipient Name',
		isRequired: true,
		type: 'text',
	},
	{
		name: 'address.email',
		label: 'Recipient Email',
		isRequired: true,
		type: 'text',
		span: 1,
	},
	{
		name: 'address.phone',
		label: 'Recipient Phone',
		isRequired: true,
		type: 'text',
		span: 1,
	},
	{
		name: 'address.street',
		label: 'Street Address',
		isRequired: true,
		type: 'textarea',
	},
	{
		name: 'address.city',
		label: 'City',
		isRequired: true,
		type: 'text',
		span: 1,
	},
	{
		name: 'address.state',
		label: 'State',
		isRequired: false,
		type: 'text',
		span: 1,
	},
	{
		name: 'address.country',
		label: 'Country',
		isRequired: false,
		type: 'text',
		span: 1,
		value: () => 'Bangladesh',
	},
	{
		name: 'address.postalCode',
		label: 'Post Code',
		isRequired: true,
		type: 'text',
		span: 1,
	},
];

export default updateAddressModel;
