'use client';
import React, { useState, ChangeEvent, FC } from 'react';

import { Button, Flex, useDisclosure, PopoverTrigger } from '@chakra-ui/react';

import InTheLast from './InTheLast';
import DatePicker from './DatePicker';
import BetweenDates from './BetweenDates';

import {
	Filter,
	useAppDispatch,
	useAppSelector,
	FilterSelect,
	applyFilters,
	Column,
	useIsMobile,
	PopModal,
	PopModalHeader,
	PopModalCloseButton,
	PopModalBody,
} from '../../..';

type DateFilterProps = {
	field: string;
	title?: string;
	label?: string;
};

const DateFilter: FC<DateFilterProps> = ({ title, field, label }) => {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const dispatch = useAppDispatch();
	const { filters } = useAppSelector((state: any) => state.table);

	const [display, setDisplay] = useState<string | undefined>();
	const [value, setValue] = useState<string>('');
	const [operator, setOperator] = useState<string>('last');
	const [persistOperator, setPersistOperator] = useState<string>('last');

	const handleOperatorChange = (e: ChangeEvent<HTMLSelectElement>): void => {
		setOperator(e.target.value);
		setValue('');
	};

	const reset = (): void => {
		setOperator(persistOperator);
	};

	const displayValues: any = {
		last: `last ${value}`,
		eq: `${value}`,
		btwn: `between ${value}`,
		gte: `on or after ${value}`,
		lte: `before ${value}`,
	};

	const open = (): void => {
		if (value !== '' || operator !== 'last') setDisplay(displayValues[operator]);
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

		if (value !== '' || operator !== 'last') setDisplay(displayValues[operator]);
		else setDisplay(undefined);

		onClose();
	};

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
				{label} {ifFieldExists() && <span> | {display}</span>}
			</Filter>
		</span>
	);

	const isMobile = useIsMobile();

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
						value={operator}
						onChange={handleOperatorChange}>
						<option value='last'>in the last</option>
						<option value='eq'>is equal to</option>
						<option value='btwn'>is between</option>
						<option value='gte'>is on or after</option>
						<option value='lte'>is before</option>
					</FilterSelect>
					{operator === 'last' && <InTheLast setVal={setValue} />}
					{operator === 'eq' && <DatePicker setVal={setValue} />}
					{operator === 'btwn' && <BetweenDates setVal={setValue} />}
					{operator === 'gte' && <DatePicker setVal={setValue} />}
					{operator === 'lte' && <DatePicker setVal={setValue} />}
				</Column>
			</PopModalBody>
		</PopModal>
	);
};

export default DateFilter;
