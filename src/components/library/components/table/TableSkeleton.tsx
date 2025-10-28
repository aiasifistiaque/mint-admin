import { FC } from 'react';
import { Skeleton, Table } from '@chakra-ui/react';

type TableSkeletonProps = {
	col: number;
	row: number;
};

const TableSkeleton: FC<TableSkeletonProps> = ({ row, col }) => {
	return [...Array(row)].map((x, i) => (
		<Table.Row key={i}>
			{[...Array(col)].map((y, j) => (
				<Table.Cell
					key={j}
					py={4}>
					<Skeleton
						w='100%'
						h={5}
					/>
				</Table.Cell>
			))}
		</Table.Row>
	));
};

export default TableSkeleton;
