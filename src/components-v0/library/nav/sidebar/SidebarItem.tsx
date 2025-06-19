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
	radius,
} from '../..';

type SidebarItemProps = {
	children: string;
	href?: string;
	path: string;
	icon: IconNameOptions;
	sx?: any;
	isLoading?: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ href, children, path, icon, sx }) => {
	const { selected } = useAppSelector((state: any) => state.route);
	const dispatch = useAppDispatch();

	const color = useColorModeValue('#4a4a4a', '#fff');
	const bg = useColorModeValue('white', '#222');
	const hover = useColorModeValue('sidebar.hoverLight', 'sidebar.hoverDark');

	const router = useRouter();

	const changeRoute = (e: any): void => {
		if (!href) return;
		e.preventDefault();
		router.push(href);
		dispatch(navigate({ selected: path }));
	};

	const isMobile = useIsMobile();

	const Container = ({ children }: any) => {
		return href ? <Link href={href}>{children}</Link> : <>{children}</>;
	};

	// return <Link href='/'>home</Link>;

	return (
		<>
			<Flex
				userSelect='none'
				_hover={selected !== path ? { bg: hover } : !href ? { bg: hover } : {}}
				onClick={changeRoute}
				borderColor={selected == path ? 'container.borderLight' : 'transparent'}
				borderWidth='1px'
				_dark={{
					borderColor: 'container.borderDark',
				}}
				h={{ base: 10, md: 7 }}
				bg={selected == path ? bg : 'transparent'}
				sx={{ ...styles.container, ...sx }}>
				<Icon
					color={color}
					name={icon}
					size={isMobile ? 20 : undefined}
				/>
				<Text
					fontSize={{ base: '16px', md: '14px' }}
					fontWeight='600'>
					{children}
				</Text>
			</Flex>
		</>
	);
};

const styles = {
	container: {
		borderRadius: radius.CONTAINER,
		alignItems: 'center',
		gap: 3,
		px: 2.5,
		transition: 'all .1s ease-in-out',
		fontWeight: '600',
		cursor: 'pointer',
		fontSize: '.9rem',
	},
};

export default SidebarItem;
