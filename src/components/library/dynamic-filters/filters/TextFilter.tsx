'use client';

import { useState, ChangeEvent, FC } from 'react';
import { Flex, PopoverTrigger, useDisclosure, Input } from '@chakra-ui/react';

import {
	PopModal,
	PopModalHeader,
	PopModalBody,
	PopModalCloseButton,
	useIsMobile,
	useAppDispatch,
	useAppSelector,
	Filter,
	applyFilters,
} from '../..';

type IsActiveFilterProps = {
	title: string;
	field: string;
	label?: string;
};

const TextFilter: FC<IsActiveFilterProps> = ({ title, field, label }) => {
	const { onOpen, onClose, isOpen } = useDisclosure();
	const isMobile = useIsMobile();

	const dispatch = useAppDispatch();
	const { filters } = useAppSelector((state: any) => state.table);

	const [val, setVal] = useState<string | undefined>(filters[field] || '');
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
				{label} {ifFieldExists() && <span> | {filters[field]}</span>}
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
				<Input
					value={val}
					size='sm'
					onChange={handleChange}
					placeholder='Search value'
				/>
			</PopModalBody>
		</PopModal>
	);
};

export default TextFilter;
