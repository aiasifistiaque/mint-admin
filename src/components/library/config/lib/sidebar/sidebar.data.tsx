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
		href: '/users',
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
		title: 'Customers',
		href: '/customers',
		icon: 'customer',
		path: 'customers',
	},
	// {
	// 	title: 'Suppliers',
	// 	href: '/suppliers',
	// 	icon: 'customer',
	// 	path: 'suppliers',
	// },

	{
		title: 'Settings',
		href: '/settings',
		icon: 'settings-fill',
		path: 'settings',
	},
];

export default sidebar;
