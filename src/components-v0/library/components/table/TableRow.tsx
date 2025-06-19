'use client';

import React, { ReactNode, FC } from 'react';
import { RowContainerBase, RowContainerMd, useIsMobile, TableSelectItem } from '../..';

type TableRowProps = {
	children: ReactNode;
	actions?: ReactNode;
	selectable?: boolean;
	id?: string;
};

// type SelectableTableRowProps = {
// 	selectable: true;
// 	id: string;
// };

const TableRow: FC<TableRowProps> = ({ children, actions, selectable, id, ...props }) => {
	const isMobile = useIsMobile();
	const Container = isMobile ? RowContainerBase : RowContainerMd;

	return (
		<Container {...props}>
			{selectable && <TableSelectItem id={id || ''} />}
			{children}
		</Container>
	);
};

export default TableRow;
