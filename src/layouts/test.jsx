// // Module imports
// import * as bills from '../app/bills/page';
// import * as expenses from '../app/expenses/page';
// import * as invoices from '../app/invoices/page';
// import * as subscriptions from '../app/subscriptions/page';
// import * as clients from '../app/clients/page';
// import * as admins from '../app/admins/page';
// import * as issues from '../app/issues/page';
// import * as repos from '../app/repos/page';
// import * as leaves from '../app/leaves/page';
// import * as employees from '../app/employees/page';
// import * as jobposts from '../app/jobposts/page';
// import * as jobapplications from '../app/jobapplications/page';
// import * as leads from '../app/leads/page';
// import * as meetings from '../app/meetings/page';
// import * as portfolios from '../app/portfolios/page';
// import * as resources from '../app/resources/page';
// import * as maintenances from '../app/maintenances/page';
// import * as documents from '../app/documents/page';
// import * as components from '../app/components/page';
// import * as props from '../app/props/page';
// import * as fgroups from '../app/fgroups/page';

// const modules = {
// 	fgroups,
// 	components,
// 	props,
// 	bills,
// 	expenses,
// 	invoices,
// 	subscriptions,
// 	clients,
// 	employees,
// 	admins,
// 	issues,
// 	repos,
// 	leaves,
// 	jobposts,
// 	jobapplications,
// 	leads,
// 	meetings,
// 	portfolios,
// 	resources,
// 	maintenances,
// 	documents,
// };

// type FieldConfig = {
// 	fields: string[];
// 	tableFields: string[];
// 	formFields: {
// 		sectionTitle: string;
// 		fields: (string | string[])[];
// 		desctiption?: string;
// 	}[];
// };

// const getKeys = (key: any): FieldConfig => {
// 	// Ensure key exists in the imported modules
// 	if (!key || typeof key !== 'string') {
// 		throw new Error('Invalid key provided to getFields');
// 	}

// 	// Type guard to ensure module exists
// 	const module = layout[key as keyof typeof layout];
// 	if (!module) {
// 		throw new Error(`No module found for key: ${key}`);
// 	}

// 	return {
// 		fields: module.fields || [],
// 		tableFields: module.tableFields || [],
// 		formFields: module.formFields || [],
// 	};
// };

// const layout = Object.fromEntries(
// 	Object.entries(modules).map(([key, module]) => [key, getKeys(module)])
// );

// export default layout;