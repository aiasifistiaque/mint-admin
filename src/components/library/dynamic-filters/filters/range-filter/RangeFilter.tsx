'use client';
import React, { useState, ChangeEvent, FC } from 'react';

import { Flex, PopoverTrigger, useDisclosure } from '@chakra-ui/react';
import BetweenValues from './BetweenValues';

import {
	useIsMobile,
	FilterInput,
	PopModalCloseButton,
	FilterSelect,
	useAppDispatch,
	useAppSelector,
	Filter,
	PopModal,
	PopModalHeader,
	PopModalBody,
	applyFilters,
} from '../../../';

type DateFilterProps = {
	field: string;
	title?: string;
	label?: string;
};

const RangeFilter: FC<DateFilterProps> = ({ title, field, label }) => {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const dispatch = useAppDispatch();
	const { filters } = useAppSelector((state: any) => state.table);

	const [display, setDisplay] = useState<string | undefined>();
	const [value, setValue] = useState<number | undefined | string>();
	const [operator, setOperator] = useState<string>('eq');
	const [persistOperator, setPersistOperator] = useState<string>('eq');

	const handleOperatorChange = (e: ChangeEvent<HTMLSelectElement>): void => {
		setOperator(e.target.value);
		setValue(undefined);
	};

	const reset = (): void => {
		setOperator(persistOperator);
	};

	const open = (): void => {
		const displayValues: any = {
			last: `last ${value}`,
			eq: `${value}`,
			btwn: `between ${value}`,
			gte: `on or after ${value}`,
			lte: `before ${value}`,
		};

		if (value || operator !== 'eq') setDisplay(displayValues[operator]);
		else setDisplay(undefined);

		onOpen();
	};

	const popClose = (): void => {
		reset();
		onClose();
	};

	const handleClick = (): void => {
		const operatorValue = operator === 'eq' ? field : `${field}_${operator}`;
		setPersistOperator(() => operator);

		dispatch(
			applyFilters({
				key: operatorValue,
				value: value,
			})
		);

		onClose();
	};

	const isMobile = useIsMobile();

	const ifFieldExists = (): boolean => {
		return Object.keys(filters).some(
			key => key.startsWith(field) && filters[key] !== null && filters[key] !== ''
		);
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
				{label} {ifFieldExists() && <span> | {filters[field]}</span>}
			</Filter>
		</span>
	);

	return (
		<PopModal
			isMobile={isMobile}
			onOpen={open}
			onClose={popClose}
			isOpen={isOpen}
			handleClick={handleClick}
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
				<FilterSelect
					value={operator}
					onChange={handleOperatorChange}>
					<option value='eq'>is equal to</option>
					<option value='btwn'>is between</option>
					<option value='gte'>is greater than</option>
					<option value='lte'>is less than</option>
				</FilterSelect>

				{operator === 'eq' && (
					<FilterInput
						type='number'
						value={value}
						onChange={e => setValue(e.target.value)}
					/>
				)}

				{operator === 'btwn' && <BetweenValues setVal={setValue} />}
				{operator === 'gte' && (
					<FilterInput
						type='number'
						value={value}
						onChange={e => setValue(e.target.value)}
					/>
				)}
				{operator === 'lte' && (
					<FilterInput
						type='number'
						value={value}
						onChange={e => setValue(e.target.value)}
					/>
				)}
			</PopModalBody>
		</PopModal>
	);
};

export default RangeFilter;
