import { mainApi } from '@/components/library/store';
import { ListType, TableProps } from '../store.types';
import { BASE_LIMIT } from '@/lib/constants';

export const uploadApi = mainApi.injectEndpoints({
	overrideExisting: true,
	endpoints: builder => ({
		getAllUploads: builder.query<ListType<any>, any>({
			query: ({
				sort = '-createdAt',
				page = 1,
				limit = BASE_LIMIT,
				search = '',
				isActive,
				type,
				filters = {},
			}) => ({
				url: `upload?type=${type || 'image'}`,
				params: { sort, page, type, limit, search, isActive, ...filters },
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
		addVideo: builder.mutation<any, any>({
			query: body => ({
				url: 'upload/video',
				method: 'POST',
				body,
				formData: true,
			}),
			invalidatesTags: ['uploads'],
		}),
	}),
});

export const { useGetAllUploadsQuery, useAddUploadMutation, useAddVideoMutation } = uploadApi;
