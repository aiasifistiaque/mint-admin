import { Flex, FlexProps, Skeleton, Table, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { TbArrowUp, TbArrowDown, TbArrowsDownUp } from 'react-icons/tb';
import { BsInfoCircle } from 'react-icons/bs';
import { useAppDispatch, useAppSelector, updateTable, theme } from '../..';
import { FC, ReactNode } from 'react';

const { TABLE } = theme;

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
				gap={1.5}>
				{children}
				<Flex
					opacity={val == sort || val == `-${sort}` ? 1 : 0.35}
					fontSize='12px'>
					{icon}
				</Flex>
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
			h={TABLE.head.height}
			_light={{ borderColor: 'container.borderLight' }}
			_dark={{
				bg: 'inherit',
				borderColor: 'container.borderDark',
			}}
			cursor={Boolean(sort) ? 'pointer' : 'default'}
			// Only sortable columns react to the pointer, so the affordance says
			// which headers actually do something.
			transition='color .15s ease'
			_hover={Boolean(sort) ? { color: 'text.light', _dark: { color: 'text.dark' } } : undefined}
			onClick={handleSort}
			userSelect='none'>
			<Flex
				px={{ base: 0, md: TABLE.cell.paddingX }}
				py={2}
				align='center'
				gap={1.5}
				fontSize={TABLE.head.fontSize}
				letterSpacing={TABLE.head.letterSpacing}
				textTransform='uppercase'
				fontWeight='600'
				whiteSpace='nowrap'
				color='table.head.textLight'
				_dark={{
					color: 'table.head.textDark',
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
