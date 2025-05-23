import { URL } from '../..';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tags = [
	'content',
	'brand',
	'brands',
	'category',
	'categories',
	'collection',
	'collections',
	'count',
	'coupon',
	'coupons',
	'filter',
	'filters',
	'organizatin',
	'organizations',
	'product',
	'products',
	'role',
	'roles',
	'scan',
	'self',
	'sum',
	'tag',
	'tags',
	'upload',
	'uploads',
	'user',
	'users',
	'adjustments/damages',
	'damages',
	'expenses',
	'projects',
	'bills',
	'tcclients',
	'billsubscriptions',
	'plannedmodels',
	'plannedprojects',
	'plannedfeatures',
	'plannedpages',
	'props',
	'components',
	'resources',
	'issues',
	'maintenances',
	'services',
	'portfolios',
	'teams',
	'items',
	'schema',
	'repos',
	'softwares',
	'employees',
	'leaves',
	'invoices',
	'meetings',
	'jobapplications',
	'jobposts',
	'documents',
	'clients',
	'adminroles',
	'admins',
	'leads',
	'fgroups',
	'purchasedthemes',
	'themes',
	'sellers',
	'shops',
	'suppliers',
	'ledgers',
	'deliveries',
	'returns',
	'payments',
	'orders',
	'customers',
	'products',
	'feedbacks',
	'collections',
];

export const mainApi = createApi({
	reducerPath: 'mainApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${URL.api}/api`,
		prepareHeaders: (headers, { getState }) => {
			const token: string = (getState() as any).auth?.token;
			if (token) {
				headers.set('authorization', token);
			}
		},
	}),
	tagTypes: tags,
	endpoints: builder => ({}),
});

export default mainApi;
