import { Flex, FlexProps, Skeleton, Th, Tooltip } from '@chakra-ui/react';
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
				gap={1}
				whileTap={{ scale: 0.9 }}>
				{children}
				{icon}
			</Flex>
		) : (
			children
		);

	const tooltip = item?.tooltip && (
		<Tooltip
			label={item?.tooltip}
			hasArrow
			placement='bottom-end'>
			<span>
				<BsInfoCircle />
			</span>
		</Tooltip>
	);

	return (
		<Th
			isNumeric={isNumeric}
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
				py='5px'
				align='center'
				gap={2}
				fontWeight='700'
				color='text.light'
				_dark={{
					color: 'text.dark',
				}}
				{...props}>
				<Skeleton
					isLoaded={!isLoading}
					w='100%'>
					{body}
				</Skeleton>
				{tooltip}
			</Flex>
		</Th>
	);
};

export default Title;
