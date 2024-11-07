import React from 'react';
import { useGetByIdQuery } from '../';

const useGetItemNameById = ({ path, id }: { path: string; id: string }) => {
	const { data, isLoading, isFetching } = useGetByIdQuery(
		{
			path,
			id,
		},
		{
			skip: !id || !path,
		}
	);
	if (isLoading || isFetching) return { name: '', image: '' };
	if (!data) return { name: '', image: '' };
	if (data)
		return {
			name: data?.name,
			image: data?.image,
		};
	return { name: '', image: '' };
};

export default useGetItemNameById;
