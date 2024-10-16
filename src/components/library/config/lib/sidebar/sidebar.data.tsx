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
		sectionTitle: 'Shops',
		title: 'Shops',
		href: '/shops',
		icon: 'order',
		path: 'shops',
	},
	{
		title: 'User',
		href: '/users',
		icon: 'order',
		path: 'sellers',
	},

	{
		title: 'Settings',
		href: '/settings',
		icon: 'settings-fill',
		path: 'settings',
	},
];

export default sidebar;
