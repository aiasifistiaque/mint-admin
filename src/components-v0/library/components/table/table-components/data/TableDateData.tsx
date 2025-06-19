import moment from 'moment';
import React from 'react';
import { CustomTd } from '.';
import { TableCellProps } from '@chakra-ui/react';

type ComponentProps = TableCellProps & {
	children: any;
};

const TableData: React.FC<ComponentProps> = ({ children, ...props }) => {
	return (
		<CustomTd
			fontSize='.7rem'
			{...props}>
			{moment(children).calendar()}
		</CustomTd>
	);
};

export default TableData;
