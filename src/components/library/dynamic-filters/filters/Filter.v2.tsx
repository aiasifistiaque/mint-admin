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
			borderRadius='full'
			border={isActive ? '2px dashed' : '1px dashed'}
			borderColor={isActive ? 'border.secondary_light' : '#bbb'}
			color='gray.600'
			fontWeight='600'
			shadow={isActive ? 'none' : 'sm'}
			_dark={{
				borderColor: isActive ? 'border.secondary_dark' : 'border.dark',
				color: isActive ? 'text.dark' : 'border.secondary_light',
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
					name='config'
					size={14}
				/>
			)}
			<TagLabel
				mx={1}
				ml={isActive ? 0.5 : 1.5}
				fontSize='13px'
				fontWeight={isActive ? '700' : '400'}>
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
