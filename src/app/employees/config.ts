import { FormLayout } from '@/components/library';

export const fields = [
	'code',
	'photo',

	'name',
	'email',

	'phone',
	'gender',

	'dob',
	'maritalStatus',

	'bloodGroup',
	'nationality',

	'employeeType',
	'reportingTo',

	//Address
	'presentAddress',
	'permanentAddress',

	//Education
	'university',
	'degree',
	'passingYear',
	'education',

	'whatsApp',
	'github',
	'discord',
	'nid',

	'status',
	'jobTitle',
	'department',
	'joiningDate',

	//Salary
	'salary',
	'bKash',
	'salaryDisburstmentPreference',
	'bankAccountName',
	'bankAccount',
	'bankName',
	'branchName',
	'bankRoutingNumber',

	//Experience
	'linkedIn',
	'experience',

	//Emergency Contact
	'adminId',
	'emergencyContactName',
	'emergencyContactRelationship',
	'emergencyContactNumber',

	//Contact
	'contractEndDate',
	'contractDoc',

	//Skills
	'skills',
	'foodSubsidy',

	//attachments
	'nidAttachment',
	'cvAttachment',

	//pricvacy
	'createdAt',
	'addedBy',
	'privacy',
	'access',
];

export const formFields: FormLayout = [
	{
		sectionTitle: 'Employee Details',
		fields: [
			'photo',
			['name', 'status'],
			['phone', 'email'],
			['gender', 'dob'],
			['employeeType', 'reportingTo'],
			['adminId', 'foodSubsidy'],
			'cvAttachment',
		],
	},
	{
		sectionTitle: 'Job Details',
		fields: [['jobTitle', 'department'], ['joiningDate', 'contractEndDate'], 'contractDoc'],
	},
	{
		sectionTitle: 'Personal Details',
		fields: [['maritalStatus', 'bloodGroup'], ['nid', 'nationality'], 'nidAttachment'],
	},
	{
		sectionTitle: 'Employee Address',
		fields: ['presentAddress', 'permanentAddress'],
	},
	{
		sectionTitle: 'Socials & Contact Details',
		fields: [
			['whatsApp', 'discord'],
			['github', 'linkedin'],
		],
	},
	{
		sectionTitle: 'Salary & Bank Details',
		fields: [
			['salary', 'salaryDisburstmentPreference'],
			['bkash', 'bankAccountName'],
			['bankAccount', 'bankName'],
			['branchName', 'bankRoutingNumber'],
		],
	},
	{
		sectionTitle: 'Emergency Contact',
		fields: ['emergencyContactName', ['emergencyContactRelationship', 'emergencyContactNumber']],
	},
	{
		sectionTitle: 'Education & Experience',
		fields: [['university', 'degree'], ['passingYear', 'skills'], 'education', 'experience'],
	},
	{
		sectionTitle: 'Access & Privacy',
		fields: ['privacy', 'access'],
	},
];

export const tableFields = [
	'code',
	'name',
	'email',
	'phone',
	'gender',
	'employeeType',
	'reportingTo',
	'whatsApp',
	'github',
	'discord',
	'jobTitle',
	'joiningDate',
	'contractEndDate',
	'foodSubsidy',
];
