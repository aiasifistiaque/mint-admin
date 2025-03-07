import { mainApi } from '@/components/library/store';
import { User, ListType, TableProps } from '../store.types';
import { BASE_LIMIT } from '@/lib/constants';

export const userApi = mainApi.injectEndpoints({
	overrideExisting: true,
	endpoints: builder => ({
		getFilters: builder.query<any, string>({
			query: id => `${id}/get/filters`,
		}),
		getSelectData: builder.query<any, string>({
			query: id => `${id}?limit=1000`,
			providesTags: ['filters', 'products', 'brands', 'categories', 'coupons', 'Items', 'items'],
		}),

		getAllUsers: builder.query<ListType<User>, TableProps>({
			query: ({
				sort = '-createdAt',
				page = 1,
				limit = BASE_LIMIT,
				search = '',
				filters = {},
			}) => ({
				url: 'users',
				params: { sort, page, limit, search, ...filters },
			}),
			providesTags: ['users'],
		}),
	}),
});

export const { useGetAllUsersQuery, useGetFiltersQuery, useGetSelectDataQuery } = userApi;
