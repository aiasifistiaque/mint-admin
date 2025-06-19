import React, { FC } from 'react';
import { Skeleton, Td, Tr } from '@chakra-ui/react';

type TableSkeletonProps = {
	col: number;
	row: number;
};

const TableSkeleton: FC<TableSkeletonProps> = ({ row, col }) => {
	return [...Array(row)].map((x, i) => (
		<Tr key={i}>
			{[...Array(col)].map((y, j) => (
				<Td
					key={j}
					py={4}>
					<Skeleton
						w='100%'
						h={5}
					/>
				</Td>
			))}
		</Tr>
	));
};

export default TableSkeleton;
