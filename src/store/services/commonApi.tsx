import { BASE_LIMIT } from '@/lib/constants';
import { ModelType } from '../../components/library/types';
import mainApi from './mainApi';

export const userApi = mainApi.injectEndpoints({
	overrideExisting: true,
	endpoints: builder => ({
		getFilters: builder.query<any, string>({
			query: id => `${id}/get/filters`,
			providesTags: ['Filters'],
		}),
		getAll: builder.query<any, any>({
			query: ({
				sort = '-createdAt',
				page = 1,
				limit = BASE_LIMIT,
				search = '',
				isActive,
				filters = {},
				path,
			}) => ({
				url: path,
				params: { sort, page, limit, search, isActive, ...filters },
			}),
			providesTags: (result, error, { path }) => [path],
		}),
		getSelectData: builder.query<any, string>({
			query: (id: ModelType) => `${id}?limit=1000&fields=name&sort=name`,
			providesTags: ['filters', 'products', 'brands', 'categories', 'coupons', 'collections'],
		}),
		getById: builder.query<any, { path: string; id: string }>({
			query: ({ path, id }): any => `${path}/${id}`,
			providesTags: ['products', 'brands', 'categories', 'coupons'],
		}),
		post: builder.mutation<any, { path: string; body: any }>({
			query: ({ path, body }): any => ({
				url: path,
				method: 'POST',
				body: body,
			}),
			invalidatesTags: (result, error, { path }) => [path],
		}),
		updateById: builder.mutation<any, { path: string; id: string; body: any; invalidate?: any }>({
			query: ({ path, id, body }): any => ({
				url: `${path}/${id}`,
				method: 'PUT',
				body: body,
			}),
			invalidatesTags: (result, error, { path, id, invalidate = '' }) => [path, invalidate],
		}),
		deleteById: builder.mutation<any, { path: string; id: string }>({
			query: ({ path, id }): any => ({
				url: `${path}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, { path, id }) => [path],
		}),
	}),
});

export const {
	useGetFiltersQuery,
	useGetSelectDataQuery,
	useGetByIdQuery,
	useUpdateByIdMutation,
	useGetAllQuery,
	useDeleteByIdMutation,
	usePostMutation,
} = userApi;
