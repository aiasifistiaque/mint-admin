'use client';
import React, { FC, useState } from 'react';

import { Flex, PopoverTrigger, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { applyFilters } from '../..';

import {
	useIsMobile,
	useAppDispatch,
	useAppSelector,
	Column,
	Filter,
	FilterInput,
	PopModal,
	PopModalHeader,
	PopModalBody,
	PopModalCloseButton,
	FilterCheckbox,
} from '../..';

type OptionType = {
	value: string;
	label: string;
};

type FilterProps = {
	title: string;
	field: string;
	label?: string;
	options: OptionType[];
};

const MultiSelectFilter: FC<FilterProps> = ({ title, field, options, label }) => {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const dispatch: any = useAppDispatch();
	const { filters } = useAppSelector((state: any) => state.table);

	const [val, setVal] = useState<string[]>([]);
	const [search, setSearch] = useState<string>('');

	const handleSearch = (e: any) => {
		setSearch(e.target.value);
	};

	const handleChange = (e: any) => {
		setVal(val => {
			if (val.includes(e.target.name)) {
				return val.filter(item => item !== e.target.name);
			} else {
				return [...val, e.target.name];
			}
		});
	};

	const open = () => {
		setVal(filters[field] ? filters[field].split(',') : []);
		onOpen();
	};
	const popClose = () => {
		setVal(filters[field] ? filters[field].split(',') : []);
		setSearch('');
		onClose();
	};
	const handleClick = () => {
		const arr = val;
		dispatch(
			applyFilters({
				key: field,
				value: val?.length > 0 ? arr.join(',') : '',
			})
		);
		popClose();
	};
	const isMobile = useIsMobile();

	const ifFieldExists = (): boolean => {
		return Object.keys(filters).some(
			key => key.startsWith(field) && filters[key] !== null && filters[key] !== ''
		);
	};

	const getLabelsFromFilters = (): string => {
		const filterValue = filters[field];
		// Split the filter value into an array of strings
		const valuesArray = filterValue.split(',');

		// Map the values to their corresponding labels
		const labelsArray = valuesArray
			.map((value: any) => {
				const option = options.find(option => option?.value === value?.trim());
				return option ? option?.label : '';
			})
			.filter((label: any) => label !== ''); // Filter out any empty labels

		// Join the labels into a comma-separated string
		return labelsArray.join(', ');
	};

	const onFilterReset = (e: any) => {
		e.stopPropagation();
		e.preventDefault();
		dispatch(
			applyFilters({
				key: field,
				value: '',
			})
		);
	};

	const button = (
		<span>
			<Filter
				isActive={ifFieldExists()}
				onCancel={onFilterReset}>
				{label} {ifFieldExists() && <span> | {getLabelsFromFilters()}</span>}
			</Filter>
		</span>
	);
	return (
		<PopModal
			handleClick={handleClick}
			isMobile={isMobile}
			onOpen={open}
			onClose={popClose}
			isOpen={isOpen}
			trigger={
				isMobile ? (
					<Flex onClick={onOpen}>{button}</Flex>
				) : (
					<PopoverTrigger>{button}</PopoverTrigger>
				)
			}>
			<PopModalHeader isMobile={isMobile}>{title}</PopModalHeader>
			<PopModalCloseButton isMobile={isMobile} />
			<PopModalBody isMobile={isMobile}>
				<FilterInput
					type='text'
					value={search}
					onChange={handleSearch}
				/>

				<Column
					maxH={{ base: 'auto', md: '180px' }}
					overflowY='scroll'
					gap={2}>
					{options?.length === 0 && <FilterCheckbox>No options available</FilterCheckbox>}
					{options
						.filter(option => option?.label?.toLowerCase()?.includes(search?.toLowerCase()))
						.map((option: any, i: number) => (
							<FilterCheckbox
								isChecked={val.includes(option?.value) ? true : false}
								onChange={handleChange}
								name={option?.value}
								key={i}>
								{option?.label}
							</FilterCheckbox>
						))}
				</Column>
			</PopModalBody>
		</PopModal>
	);
};

export default MultiSelectFilter;
