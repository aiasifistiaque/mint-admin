import { Center, Flex } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { HiArrowUturnLeft, HiArrowUturnRight } from 'react-icons/hi2';

import { useIsMobile, useAppDispatch, useAppSelector } from '../../hooks';
import { SquareButton, TableHeading, updateTable } from '../..';
import { SHOW_PER_PAGE_OPTIONS } from '../..';
import { SelectInput, CurrentPage } from './_components';

type PaginationProps = {
	data: any;
	showPerPage?: boolean;
};

const Pagination: FC<PaginationProps> = ({ data, showPerPage = true }) => {
	const { page, limit } = useAppSelector(state => state.table);
	const dispatch = useAppDispatch();
	const isMobile = useIsMobile();

	const update = ({ setPage, setLimit }: { setPage?: number; setLimit?: number }) => {
		dispatch(updateTable({ page: setPage, limit: setLimit }));
	};

	const toStart = () => update({ setPage: 1 });

	const toLast = () => update({ setPage: data?.totalPages });

	const next = () => {
		if (page < data?.totalPages) update({ setPage: page + 1 });
	};

	const back = () => update({ setPage: page - 1 });

	const perpage = (
		<>
			{!isMobile && <TableHeading>SHOWING RESULTS</TableHeading>}
			<SelectInput
				value={limit}
				onChange={(e: any) => update({ setLimit: e.target.value })}>
				{SHOW_PER_PAGE_OPTIONS.map(({ value, label }) => (
					<option
						key={value}
						value={value}>
						{label}
					</option>
				))}
			</SelectInput>
		</>
	);

	return (
		<Flex
			justify='flex-end'
			align='center'>
			{showPerPage && <Center gap={2}>{perpage}</Center>}

			<Flex
				p={2}
				alignSelf='flex-end'>
				<SquareButton
					label='To the beginning'
					onClick={toStart}
					borderLeftRadius={4}>
					<HiArrowUturnLeft size={18} />
				</SquareButton>
				<SquareButton
					label='Previous Page'
					onClick={back}>
					<IoIosArrowBack size={20} />
				</SquareButton>

				<CurrentPage>
					{!isMobile
						? `Page ${page} of ${data?.totalPages || '--'}`
						: `${page}/${data?.totalPages || '--'}`}
				</CurrentPage>
				<SquareButton
					label='Next Page'
					onClick={next}>
					<IoIosArrowForward size={20} />
				</SquareButton>
				<SquareButton
					label='To the end'
					onClick={toLast}
					borderRightRadius={4}>
					<HiArrowUturnRight size={18} />
				</SquareButton>
			</Flex>
		</Flex>
	);
};

export default Pagination;
