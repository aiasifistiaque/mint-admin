import { URL } from '../..';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tags = [
	'donors',
	'donations',
	'roles',
	'groups',
	'expenses',
	'documents',
	'blogs',
	'users',
	'emails',
	'subscriptions',
	'newsletters',
	'auth',
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
