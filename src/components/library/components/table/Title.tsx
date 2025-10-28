import { Flex, FlexProps, Skeleton, Table, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { TbArrowUp, TbArrowDown, TbArrowsDownUp } from 'react-icons/tb';
import { BsInfoCircle } from 'react-icons/bs';
import { useAppDispatch, useAppSelector, updateTable } from '../..';
import { FC, ReactNode } from 'react';

export type TitleProps = FlexProps & {
	children: ReactNode;
	info?: string;
	sort?: string;
	ifItemsSelected?: boolean;
	isNumeric?: boolean;
	isLoading?: boolean;
	item?: any;
};

export const Title: FC<TitleProps> = ({
	children,
	sort,
	info,
	ifItemsSelected,
	isNumeric,
	item,
	isLoading = false,
	...props
}) => {
	const { sort: val } = useAppSelector(state => state.table);
	const dispatch = useAppDispatch();
	const icon =
		val == `-${sort}` ? <TbArrowUp /> : val == sort ? <TbArrowDown /> : <TbArrowsDownUp />;

	const handleSort = (): any => {
		if (!sort) return;
		const sortVal: string = val == sort ? `-${sort}` : sort;
		dispatch(updateTable({ sort: sortVal, page: 1 }));
	};

	const body =
		Boolean(sort) && !ifItemsSelected ? (
			<Flex
				as={motion.div}
				align='center'
				gap={1}>
				{children}
				{icon}
			</Flex>
		) : (
			children
		);

	const tooltip = item?.tooltip && (
		<Tooltip.Root>
			<Tooltip.Trigger asChild>
				<span>
					<BsInfoCircle />
				</span>
			</Tooltip.Trigger>
			<Tooltip.Positioner>
				<Tooltip.Content>{item?.tooltip}</Tooltip.Content>
			</Tooltip.Positioner>
		</Tooltip.Root>
	);

	return (
		<Table.ColumnHeader
			bg='inherit'
			_light={{ borderColor: 'container.borderLight' }}
			_dark={{
				bg: 'inherit',
				borderColor: 'container.borderDark',
			}}
			cursor={Boolean(sort) ? 'pointer' : 'default'}
			onClick={handleSort}
			userSelect='none'>
			<Flex
				px={{ base: 0, md: 4 }}
				py={2}
				align='center'
				gap={2}
				textTransform='uppercase'
				fontWeight='600'
				color='text.light'
				_dark={{
					color: 'text.dark',
				}}
				{...props}>
				<Skeleton
					loading={isLoading}
					w='100%'>
					{body}
				</Skeleton>
				{tooltip}
			</Flex>
		</Table.ColumnHeader>
	);
};

export default Title;
