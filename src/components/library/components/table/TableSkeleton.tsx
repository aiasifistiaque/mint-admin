import { FC } from 'react';
import { Skeleton, Table } from '@chakra-ui/react';
import { theme } from '../..';

const { TABLE } = theme;

// Uneven bar widths, cycled per column, so a loading table looks like data
// arriving rather than a block of identical grey rectangles.
const WIDTHS = ['72%', '48%', '86%', '38%', '62%', '54%'];

type TableSkeletonProps = {
	col: number;
	row: number;
};

const TableSkeleton: FC<TableSkeletonProps> = ({ row, col }) => {
	return [...Array(row)].map((x, i) => (
		<Table.Row
			key={i}
			h={TABLE.row.height}
			bg='transparent'>
			{[...Array(col)].map((y, j) => (
				<Table.Cell
					key={j}
					px={TABLE.cell.paddingX}
					py={TABLE.cell.paddingY}
					borderColor='table.innerBorder.light'
					_dark={{ borderColor: 'table.innerBorder.dark' }}>
					<Skeleton
						w={WIDTHS[(i + j) % WIDTHS.length]}
						h='12px'
						borderRadius='full'
					/>
				</Table.Cell>
			))}
		</Table.Row>
	));
};

export default TableSkeleton;
