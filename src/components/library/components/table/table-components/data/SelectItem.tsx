'use client';

import { TableCellProps, Checkbox } from '@chakra-ui/react';
import { useState, FC, useEffect, ChangeEvent } from 'react';

import { selectItem } from '../../../../store';
import { useAppDispatch, useAppSelector } from '../../../../hooks';

// Define the type for the props of the TableData component
type TableDataPropsType = TableCellProps & {
	id: string;
	isMobile?: boolean;
};

const SelectItem: FC<TableDataPropsType> = ({ id, ...props }) => {
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
		<Checkbox
			size={'lg'}
			isChecked={selectedItems.includes(id)}
			onChange={handleCheck}
			colorScheme='brand'
		/>
	);
};

export default SelectItem;
