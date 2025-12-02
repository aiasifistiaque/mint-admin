'use client';

import { Flex, FlexProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { useColorMode } from '@/components/ui/color-mode';

import { Icon, radius } from '../..';

type FilterProps = FlexProps & {
	children: ReactNode;
	isActive?: boolean;
	onCancel?: any;
};

const Filter: FC<FilterProps> = ({ children, isActive = false, onCancel, ...props }) => {
	const { colorMode } = useColorMode();
	const iconColor = colorMode === 'light' ? 'gray.600' : 'text.secondary.dark';
	return (
		<Flex
			userSelect='none'
			cursor='pointer'
			bg='table.row.light'
			borderRadius='full'
			border={isActive ? '2px dashed' : '1px dashed'}
			borderColor={isActive ? 'border.secondary_light' : '#bbb'}
			color='gray.600'
			fontWeight='600'
			shadow={isActive ? 'none' : 'xs'}
			_dark={{
				borderColor: isActive ? 'border.secondary_dark' : 'border.dark',
				color: isActive ? 'text.dark' : 'border.secondary_light',
				bg: 'table.row.dark',
			}}
			fontSize='sm'
			mr={0.5}
			px={2}
			py={1}
			alignItems='center'
			display='inline-flex'
			{...props}>
			{!isActive && (
				<Icon
					color={iconColor}
					name='config'
					size={14}
				/>
			)}
			<Flex
				mx={1}
				ml={isActive ? 0.5 : 1.5}
				fontSize='13px'
				fontWeight={isActive ? '700' : '400'}>
				{children}
			</Flex>
			{isActive && (
				<Flex onClick={onCancel}>
					<Icon
						color={iconColor}
						name='close'
						size={16}
					/>
				</Flex>
			)}
		</Flex>
	);
};

export default Filter;
