import { mainApi } from '@/components/library/store';
import { ListType, TableProps } from '../store.types';
import { BASE_LIMIT } from '@/lib/constants';

export const uploadApi = mainApi.injectEndpoints({
	overrideExisting: true,
	endpoints: builder => ({
		getAllUploads: builder.query<ListType<any>, TableProps>({
			query: ({
				sort = '-createdAt',
				page = 1,
				limit = BASE_LIMIT,
				search = '',
				isActive,
				filters = {},
			}) => ({
				url: 'upload',
				params: { sort, page, limit, search, isActive, ...filters },
			}),
			providesTags: ['uploads'],
		}),
		addUpload: builder.mutation<any, any>({
			query: body => ({
				url: 'upload',
				method: 'POST',
				body,
				formData: true,
			}),
			invalidatesTags: ['uploads'],
		}),
	}),
});

export const { useGetAllUploadsQuery, useAddUploadMutation } = uploadApi;
