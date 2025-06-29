'use client';
import { TableCellProps, Checkbox, Flex } from '@chakra-ui/react';
import { useState, FC, useEffect, ChangeEvent } from 'react';
import { CustomTd } from '.';
import { useAppDispatch, useAppSelector, selectItem } from '../../../..';

// Define the type for the props of the TableData component
type TableDataPropsType = TableCellProps & {
	id: string;
	isMobile?: boolean;
};

const TableSelectItem: FC<TableDataPropsType> = ({ id, isMobile = false, ...props }) => {
	const [checked, setChecked] = useState(false);

	const { selectedItems }: any = useAppSelector(state => state.table);
	const dispatch = useAppDispatch();

	const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
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
				type='selectMenu'
				mb={{ base: -4, md: 0 }}
				alignItems='center'
				{...props}>
				<Checkbox
					size='lg'
					isChecked={selectedItems.includes(id)}
					onChange={handleCheck}
					colorScheme='brand'
				/>
			</CustomTd>
			{isMobile && <Flex h={0}>{null}</Flex>}
		</>
	);
};

export default TableSelectItem;
