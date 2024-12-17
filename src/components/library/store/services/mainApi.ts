import { URL } from '../../';
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
