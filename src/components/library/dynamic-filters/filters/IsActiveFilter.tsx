'use client';
import React from 'react';

import {
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverTrigger,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';

import { FilterButton, PopoverContainer, PopoverHeader, Column, FilterSelect } from '../../';

type IsActiveFilterProps = {
	trigger: React.ReactNode;
	value: string;
	onChange: any;
};

const IsActiveFilter: React.FC<IsActiveFilterProps> = ({ trigger, value, onChange }) => {
	const arrow = useColorModeValue('menu.light', 'menu.dark');
	const { onOpen, onClose, isOpen } = useDisclosure();

	const [val, setVal] = React.useState<string | undefined>(value);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setVal(e.target.value);
	};
	const open = () => {
		setVal(value);
		onOpen();
	};

	const popClose = () => {
		setVal('');
		onClose();
	};

	const handleClick = () => {
		onChange(val);
		popClose();
	};
	return (
		<Popover
			onOpen={open}
			onClose={close}
			isOpen={isOpen}>
			<PopoverTrigger>{trigger}</PopoverTrigger>
			<PopoverContainer>
				<PopoverArrow bg={arrow} />
				<PopoverHeader>Filter by status</PopoverHeader>
				<PopoverBody>
					<Column
						gap={3}
						pb={1}>
						<FilterSelect
							value={val}
							onChange={handleChange}>
							<option value='true'>True</option>
							<option value='false'>False</option>
						</FilterSelect>
						<FilterButton onClick={handleClick}>Apply</FilterButton>
					</Column>
				</PopoverBody>
			</PopoverContainer>
		</Popover>
	);
};

export default IsActiveFilter;
