import { Flex, FlexProps, Skeleton, Th, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { TbArrowUp, TbArrowDown, TbArrowsDownUp } from 'react-icons/tb';
import { BsInfoCircle } from 'react-icons/bs';
import { useAppDispatch, useAppSelector, updateTable } from '../..';

export type TitleProps = FlexProps & {
	children: React.ReactNode;
	info?: string;
	sort?: string;
	ifItemsSelected?: boolean;
	isNumeric?: boolean;
	isLoading?: boolean;
};

export const Title: React.FC<TitleProps> = ({
	children,
	sort,
	info,
	ifItemsSelected,
	isNumeric,
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

	const tooltip = info && (
		<Tooltip
			label={info}
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
			_light={{ borderBottomColor: 'container.borderLight' }}
			cursor={Boolean(sort) ? 'pointer' : 'default'}
			onClick={handleSort}
			userSelect='none'>
			<Flex
				py={3}
				align='center'
				gap={2}
				fontWeight='700'
				_light={{
					color: 'text.light',
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
