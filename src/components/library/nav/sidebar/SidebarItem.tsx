'use client';
import React from 'react';
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
	useIsMobile,
	Icon,
	useAppDispatch,
	useAppSelector,
	navigate,
	IconNameOptions,
} from '../../';

type SidebarItemProps = {
	children: string;
	href: string;
	path: string;
	icon: IconNameOptions;
	sx?: any;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ href, children, path, icon, sx }) => {
	const { selected } = useAppSelector((state: any) => state.route);
	const dispatch = useAppDispatch();

	const color = useColorModeValue('#4a4a4a', '#fff');
	const bg = useColorModeValue('white', '#222');
	const hover = useColorModeValue('#fafafa', '#141414');

	const router = useRouter();

	const changeRoute = (e: any): void => {
		e.preventDefault();
		router.push(href);
		dispatch(navigate({ selected: path }));
	};

	const isMobile = useIsMobile();

	const Container = ({ children }: any) => {
		return href ? (
			<Link
				href={href}
				passHref={children}>
				{children}
			</Link>
		) : (
			<>{children}</>
		);
	};

	const isSelected: boolean = selected === path;

	return (
		<Link href={href}>
			<Flex
				userSelect='none'
				_hover={selected !== path ? { bg: hover } : {}}
				onClick={changeRoute}
				h={{ base: 10, md: 7 }}
				bg={isSelected ? bg : 'transparent'}
				sx={{ ...styles.container, ...sx }}>
				<Icon
					color={color}
					name={icon}
					size={isMobile ? 20 : undefined}
				/>
				<Text
					fontSize={{ base: '16px', md: '14px' }}
					fontWeight={isSelected ? '700' : '600'}>
					{children}
				</Text>
			</Flex>
		</Link>
	);
};

const styles = {
	container: {
		borderRadius: 10,
		alignItems: 'center',
		gap: 3,
		px: 2.5,
		transition: 'all .2s ease-in-out',
		fontWeight: '600',
		cursor: 'pointer',
		fontSize: '.9rem',
	},
};

export default SidebarItem;
