'use client';

import { useGetFiltersQuery } from '@/store/services/usersApi';
import { Button } from '@chakra-ui/react';

import { clearFilters } from '@/store/slices/tableSlice';

import { BooleanFilter, DateFilter, MultiSelectFilter, RangeFilter, useAppDispatch } from '../';
import { FilterSectionContainer } from './filter-components';

type FilterItemType = {
	field: any;
	label: any;
	title: any;
	type: 'boolean' | 'multi-select' | 'date' | 'range';
	options?: any;
};

const DynamicFilters = ({ path }: { path: any }) => {
	const dispatch = useAppDispatch();

	const { data, isFetching, isError } = useGetFiltersQuery(path);

	const handleClearFilter = () => dispatch(clearFilters());

	if (isFetching || isError) return null;

	return (
		<FilterSectionContainer>
			{data?.map((item: FilterItemType, i: number) => {
				const commonProps = {
					key: i,
					field: item?.field,
					label: item?.label,
					title: item?.title,
				};
				if (item.type === 'boolean') {
					return <BooleanFilter {...commonProps} />;
				}
				if (item.type === 'multi-select') {
					return (
						<MultiSelectFilter
							{...commonProps}
							options={item?.options}
						/>
					);
				}
				if (item.type === 'date') {
					return <DateFilter {...commonProps} />;
				}
				if (item.type === 'range') {
					return <RangeFilter {...commonProps} />;
				}
			})}
			<Button
				onClick={handleClearFilter}
				variant='link'
				size='xs'>
				Clear filters
			</Button>
		</FilterSectionContainer>
	);
};

export default DynamicFilters;
