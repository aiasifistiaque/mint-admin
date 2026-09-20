'use client';

import { useState, ChangeEvent, FC } from 'react';
import { Flex, PopoverTrigger, useDisclosure } from '@chakra-ui/react';

import {
	PopModal,
	PopModalHeader,
	PopModalBody,
	PopModalCloseButton,
	useIsMobile,
	useAppDispatch,
	useAppSelector,
	Filter,
	FilterSelect,
	applyFilters,
} from '../..';

type IsActiveFilterProps = {
	title: string;
	field: string;
	label?: string;
};

const BooleanFilter: FC<IsActiveFilterProps> = ({ title, field, label }) => {
	const { onOpen, onClose, open: isOpen } = useDisclosure();
	const isMobile = useIsMobile();

	const dispatch = useAppDispatch();
	const { filters } = useAppSelector((state: any) => state.table);

	const [val, setVal] = useState<string | undefined>(filters[field] || '');
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
				{label}{' '}
				{ifFieldExists() && (
					// A bare `<span>` picks up the global `span { color }` rule (light
					// text meant for a dark page) instead of inheriting the chip's own
					// color, which is black-on-white once the chip is active — hence
					// near-invisible. `color: inherit` (highest-specificity inline
					// style) forces it back to the parent's actual color.
					<span style={{ color: 'inherit' }}> | {filters[field]}</span>
				)}
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
				<FilterSelect
					value={val}
					onChange={handleChange}>
					<option
						value=''
						disabled>
						Select an option
					</option>
					<option value='true'>True</option>
					<option value='false'>False</option>
				</FilterSelect>
			</PopModalBody>
		</PopModal>
	);
};

export default BooleanFilter;
