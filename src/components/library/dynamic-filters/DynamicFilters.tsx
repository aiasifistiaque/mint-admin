'use client';

import { Button } from '@chakra-ui/react';

import {
	BooleanFilter,
	DateFilter,
	MultiSelectFilter,
	RangeFilter,
	TextFilter,
	SelectFilter,
} from './filters';
import { FilterSectionContainer } from './filter-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { clearFilters, useGetFiltersQuery } from '../store';
import { hasActiveFilters } from '../functions';

type FilterItemType = {
	field: any;
	label: any;
	title: any;
	type: 'boolean' | 'multi-select' | 'date' | 'range' | 'text' | 'select';
	options?: any;
};

const DynamicFilters = ({ path }: { path: any }) => {
	const dispatch = useAppDispatch();
	const { data, isFetching, isError } = useGetFiltersQuery(path);
	const { filters } = useAppSelector(state => state.table);
	const handleClearFilter = () => dispatch(clearFilters());

	if (isFetching || isError) return null;

	return (
		<FilterSectionContainer>
			{data?.map((item: FilterItemType, i: number) => {
				const commonProps = {
					field: item?.field,
					label: item?.label,
					title: item?.title,
				};
				if (item.type === 'boolean') {
					return (
						<BooleanFilter
							key={i}
							{...commonProps}
						/>
					);
				}
				if (item.type === 'multi-select') {
					return (
						<MultiSelectFilter
							key={i}
							{...commonProps}
							options={item?.options}
						/>
					);
				}
				if (item.type === 'date') {
					return (
						<DateFilter
							key={i}
							{...commonProps}
						/>
					);
				}
				if (item.type === 'text') {
					return (
						<TextFilter
							key={i}
							{...commonProps}
						/>
					);
				}
				if (item.type === 'range') {
					return (
						<RangeFilter
							key={i}
							{...commonProps}
						/>
					);
				}
				if (item.type === 'select') {
					return (
						<SelectFilter
							key={i}
							{...commonProps}
							options={item?.options}
						/>
					);
				}
			})}
			{hasActiveFilters(filters) && (
				<Button
					_dark={{ color: 'text.dark' }}
					onClick={handleClearFilter}
					variant='link'
					fontWeight='600'
					ml={2}
					size='sm'>
					Clear filters
				</Button>
			)}
		</FilterSectionContainer>
	);
};

export default DynamicFilters;
