import { SidebarItemType } from './types';

const sidebar: SidebarItemType[] = [
	{
		title: 'Dashboard',
		href: '/',
		icon: 'home',
		path: 'dashboard',
	},

	{
		startOfSection: true,
		sectionTitle: 'Shop Management',
		title: 'Shops',
		href: '/shops',
		icon: 'order',
		path: 'shops',
	},
	{
		title: 'Packages',
		href: '/packages',
		icon: 'order',
		path: 'packages',
	},
	{
		title: 'User',
		href: '/sellers',
		icon: 'order',
		path: 'sellers',
	},
	{
		startOfSection: true,
		sectionTitle: 'Data Management',
		title: 'Products',
		href: '/products',
		icon: 'product',
		path: 'products',
	},
	// {
	// 	title: 'Categories',
	// 	href: '/categories',
	// 	icon: 'category',
	// 	path: 'categories',
	// },
	{
		title: 'Leads',
		href: '/leads',
		icon: 'customer',
		path: 'leads',
	},
	{
		title: 'Customers',
		href: '/customers',
		icon: 'customer',
		path: 'customers',
	},
	{
		startOfSection: true,
		sectionTitle: 'Theme',
		title: 'Themes',
		href: '/themes',
		icon: 'product',
		path: 'themes',
	},
	{
		title: 'Purchases',
		href: '/purchased-themes',
		icon: 'product',
		path: 'purchased-themes',
	},
	{
		startOfSection: true,
		sectionTitle: 'Project Management',
		title: 'Projects',
		href: '/projects',
		icon: 'customer',
		path: 'projects',
	},
	{
		title: 'Repos',
		href: '/repos',
		icon: 'customer',
		path: 'repos',
	},

	{
		startOfSection: true,
		sectionTitle: 'Admin Management',
		title: 'Admin List',
		href: '/admins',
		icon: 'customer',
		path: 'admins',
	},
	{
		title: 'Roles',
		href: '/adminroles',
		icon: 'customer',
		path: 'adminroles',
	},
	{
		title: 'Clients',
		href: '/clients',
		icon: 'customer',
		path: 'clients',
	},

	{
		title: 'Meetings',
		href: '/meetings',
		icon: 'customer',
		path: 'meetings',
	},
	{
		title: 'Documents',
		href: '/documents',
		icon: 'customer',
		path: 'documents',
	},
	{
		startOfSection: true,
		sectionTitle: 'Career',
		title: 'Job Posts',
		href: '/jobposts',
		icon: 'customer',
		path: 'jobposts',
	},
	{
		title: 'Applications',
		href: '/jobapplications',
		icon: 'customer',
		path: 'jobapplications',
	},
	{
		startOfSection: true,
		sectionTitle: 'Accounts',
		title: 'Invoices',
		href: '/invoices',
		icon: 'customer',
		path: 'invoices',
	},
	{
		startOfSection: true,
		sectionTitle: 'HR',
		title: 'Leave Management',
		href: '/leaves',
		icon: 'customer',
		path: 'leaves',
	},
	{
		startOfSection: true,
		sectionTitle: 'Website Settings',
		title: 'Team Members',
		href: '/teams',
		icon: 'customer',
		path: 'teams',
	},

	{
		startOfSection: true,
		sectionTitle: 'Account Settings',
		title: 'Settings',
		href: '/settings',
		icon: 'settings-fill',
		path: 'settings',
	},
];

export default sidebar;
