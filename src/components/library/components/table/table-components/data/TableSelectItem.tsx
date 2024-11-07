'use client';
import { TableCellProps, Checkbox, Flex } from '@chakra-ui/react';
import React, { useState, FC, useEffect, ChangeEvent } from 'react';
import { CustomTd } from './';
import { useAppDispatch, useAppSelector, selectItem, useIsMobile } from '../../../../';

// Define the type for the props of the TableData component
type TableDataPropsType = TableCellProps & {
	id: string;
};

const TableSelectItem: FC<TableDataPropsType> = ({ id, ...props }) => {
	const [checked, setChecked] = useState(false);

	const { selectedItems }: any = useAppSelector(state => state.table);
	const dispatch = useAppDispatch();

	const isMobile = useIsMobile();

	const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
		dispatch(selectItem({ id, isSelected: e.target.checked }));
		setChecked(e.target.checked);
	};

	useEffect(() => {
		const isSelected = selectedItems.includes(id);
		setChecked(isSelected);
	}, [selectedItems]);

	return (
		<>
			<CustomTd
				mb={{ base: -4, md: 0 }}
				w='5px'
				alignItems='center'
				{...props}>
				<Checkbox
					isChecked={checked}
					onChange={handleCheck}
					colorScheme='brand'
				/>
			</CustomTd>
			{isMobile && <Flex h={0}>{null}</Flex>}
		</>
	);
};

export default TableSelectItem;
