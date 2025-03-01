'use client';
import React, { ChangeEvent, FC, useState } from 'react';

import { Flex, PopoverTrigger, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { applyFilters, FilterButton, FilterSelect } from '../..';

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

const SelectFilter: FC<FilterProps> = ({ title, field, options, label }) => {
	const arrow = useColorModeValue('menu.light', 'menu.dark');

	const { onOpen, onClose, isOpen } = useDisclosure();
	const dispatch: any = useAppDispatch();
	const { filters } = useAppSelector((state: any) => state.table);

	const [val, setVal] = useState<string | undefined>(filters[field] || '');

	const ifFieldExists = (): boolean => {
		return Object.keys(filters).some(
			key => key.startsWith(field) && filters[key] !== null && filters[key] !== ''
		);
	};

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setVal(e.target.value);
	};

	const open = () => {
		setVal(filters[field] || '');
		onOpen();
	};

	const popClose = () => {
		setVal('');
		onClose();
	};

	const handleClick = () => {
		dispatch(
			applyFilters({
				key: field,
				value: val,
			})
		);
		popClose();
	};
	const isMobile = useIsMobile();

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
				<Column
					gap={3}
					pb={1}>
					<FilterSelect
						value={val}
						onChange={handleChange}>
						<option
							value=''
							disabled>
							Select an option
						</option>

						{options.map((option, i) => (
							<option
								key={i}
								value={option.value}>
								{option.label}
							</option>
						))}
					</FilterSelect>
				</Column>
			</PopModalBody>
		</PopModal>
	);
};

export default SelectFilter;
