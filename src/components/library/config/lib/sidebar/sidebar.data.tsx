import { SidebarItemType } from './types';

const sidebar: SidebarItemType[] = [
	{
		title: 'Dashboard',
		href: '/',
		icon: 'home',
		path: 'dashboard',
	},
	{
		title: 'POS',
		href: '/pos',
		icon: 'barcode',
		path: 'pos',
	},
	{
		title: 'Order',
		href: '/orders',
		icon: 'order',
		path: 'orders',
	},

	{
		startOfSection: true,
		sectionTitle: 'Product Management',
		title: 'Products',
		href: '/products',
		icon: 'product',
		path: 'products',
	},
	{
		title: 'Categories',
		href: '/categories',
		icon: 'category',
		path: 'categories',
	},
	{
		title: 'Collections',
		href: '/collections',
		icon: 'collections',
		path: 'collections',
	},
	{
		startOfSection: true,
		sectionTitle: 'Customer Management',
		title: 'Customers',
		href: '/customers',
		icon: 'customer',
		path: 'customers',
	},
	// {
	// 	sectionTitle: 'Customer',
	// 	title: 'Feedback',
	// 	href: '/feedbacks',
	// 	icon: 'feedbacks',
	// 	path: 'feedbacks',
	// },
	{
		startOfSection: true,
		sectionTitle: 'Admin Management',
		title: 'Roles',
		href: '/roles',
		icon: 'role',
		path: 'roles',
	},
	{
		sectionTitle: 'Users',
		title: 'Users',
		href: '/users',
		icon: 'user',
		path: 'users',
	},

	{
		startOfSection: true,
		sectionTitle: 'Content',
		title: 'Store',
		href: '/store-content',
		icon: 'shop',
		path: 'store-content',
	},

	{
		title: 'Home',
		href: '/home-content',
		icon: 'content',
		path: 'home-content',
	},

	{
		startOfSection: true,
		sectionTitle: 'Reports',
		title: 'Top Products',
		href: '/reports/top-products',
		icon: 'report',
		path: 'top-products',
	},
	{
		title: 'Top Customers',
		href: '/reports/top-customers',
		icon: 'report',
		path: 'top-customers',
	},

	{
		title: 'Settings',
		href: '/settings',
		icon: 'settings-fill',
		path: 'settings',
	},
];

export default sidebar;
