'use client';
import { FC, useState } from 'react';

import { Flex, PopoverTrigger, useDisclosure } from '@chakra-ui/react';
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
	const { onOpen, onClose, open: isOpen } = useDisclosure();
	const dispatch: any = useAppDispatch();
	const { filters } = useAppSelector((state: any) => state.table);

	const [val, setVal] = useState<string[]>([]);
	const [search, setSearch] = useState<string>('');

	const handleSearch = (e: any) => {
		setSearch(e.target.value);
	};

	// Takes the option's value rather than reading `e.target.name` off a change
	// event: the checkbox is controlled now, so the toggle comes from Chakra's
	// `onCheckedChange` and there is no DOM event to read a name from.
	const handleToggle = (value: string) => {
		setVal(val => (val.includes(value) ? val.filter(item => item !== value) : [...val, value]));
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
				{label} {ifFieldExists() && `| ${getLabelsFromFilters()}`}
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
					overflowY='auto'
					gap={2}>
					{options?.length === 0 && <FilterCheckbox>No options available</FilterCheckbox>}
					{options
						.filter(option => option?.label?.toLowerCase()?.includes(search?.toLowerCase()))
						.map((option: any, i: number) => (
							// `checked`, not Chakra v2's `isChecked` — that name is not a
							// prop in v3, so it fell through to the DOM (the "React does
							// not recognize the `isChecked` prop" warning) and left
							// `checked` undefined, i.e. the box was uncontrolled and never
							// showed the filter that was actually applied.
							<FilterCheckbox
								checked={val.includes(option?.value)}
								onCheckedChange={() => handleToggle(option?.value)}
								key={option?.value ?? i}>
								{option?.label}
							</FilterCheckbox>
						))}
				</Column>
			</PopModalBody>
		</PopModal>
	);
};

export default MultiSelectFilter;
