import { TableObjectProps } from '@/components/library';
//import multiSelectMenu from './data/multiSelect';
// import itemMenu from './data/itemMenu';
import viewAllDataFields from './data/viewCustomerDataFields';
import { dataFields as customerDataField } from './createCustomer.model';
import { viewById, edit } from '.';

const dataFields: TableObjectProps = {
	title: 'Customers',
	path: 'customers',
	isModal: true,
	createModel: customerDataField,
	// clickable: true,
	//toPath: '/items/edit',
	select: {
		show: true,
		menu: [
			{
				title: 'Send SMS',
				type: 'marketing-sms',
			},
			{
				title: 'Add to group',
				type: 'edit-data-select',
				key: 'group',
				keyType: 'array',
				dataPath: 'groups',
				//dataModel: createCollection,
				prompt: {
					title: 'Add to group',
					body: 'Add Customers to group',
				},
			},
		],
	},
	export: true,

	button: {
		title: 'Add Customers',
		path: '/customers/create',
	},

	menu: [
		{
			title: 'Edit',
			type: 'edit-modal',
			dataModel: edit,
		},

		{
			title: 'View',
			type: 'link',
			href: '/view/customers',
		},
	],
	data: viewAllDataFields,
};

export default dataFields;
