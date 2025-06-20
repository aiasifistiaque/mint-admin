'use client';

import { Flex, Tag, TagLabel, TagProps, useColorModeValue } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { Icon, radius } from '../..';

type FilterProps = TagProps & {
	children: ReactNode;
	isActive?: boolean;
	onCancel?: any;
};

const Filter: FC<FilterProps> = ({ children, isActive = false, onCancel, ...props }) => {
	const iconColor = useColorModeValue('gray.600', 'text.secondary.dark');
	return (
		<Tag
			userSelect='none'
			cursor='pointer'
			bg='table.row.light'
			borderRadius={radius?.FILTER || 'full'}
			border='1px solid'
			borderColor='border.light'
			color='gray.600'
			fontWeight='600'
			shadow='xs'
			_dark={{
				borderColor: 'border.dark',
				color: 'text.secondary.dark',
				bg: 'table.row.dark',
			}}
			size='sm'
			mr={0.5}
			pl={2}
			py={1.5}
			{...props}>
			{!isActive && (
				<Icon
					color={iconColor}
					name='filter'
					size={14}
				/>
			)}
			<TagLabel
				mx={1}
				ml={1.5}
				fontSize='13px'
				fontWeight='500'>
				{children}
			</TagLabel>
			{isActive && (
				<Flex onClick={onCancel}>
					<Icon
						color={iconColor}
						name='close'
						size={16}
					/>
				</Flex>
			)}
		</Tag>
	);
};

export default Filter;
