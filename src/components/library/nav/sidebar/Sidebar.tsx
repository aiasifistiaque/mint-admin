'use client';
import { FlexProps, Heading, Stack } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import SidebarItem from './SidebarItem';

import { sidebarData as sidebar, THEME } from '../../';

import { useGetSelfQuery } from '@/store/services/authApi';

import {
	SidebarBody,
	SidebarContainer,
	SidebarContent,
	SidebarFooter,
	SidebarHeading,
	SidebarLogo,
} from './sidebar-components';

const Sidebar: React.FC<FlexProps & { closeBtn?: ReactNode }> = ({ closeBtn, ...props }) => {
	const { data } = useGetSelfQuery({});

	const title = data?.store?.name || process.env.NEXT_PUBLIC_STORE_NAME || '--';

	const main = (
		<>
			<SidebarBody>
				{sidebar.slice(0, -1).map((item, i) => (
					<Stack key={i}>
						<SidebarHeading show={item?.startOfSection}>{item?.sectionTitle}</SidebarHeading>
						<SidebarItem
							href={item?.href}
							path={item?.path}
							icon={item?.icon}>
							{item?.title}
						</SidebarItem>
					</Stack>
				))}
			</SidebarBody>
			<SidebarFooter>
				{sidebar?.length > 0 && (
					<SidebarItem
						href={sidebar[sidebar.length - 1]?.href}
						path={sidebar[sidebar.length - 1]?.path}
						icon={sidebar[sidebar.length - 1].icon}>
						{sidebar[sidebar.length - 1]?.title}
					</SidebarItem>
				)}
			</SidebarFooter>
		</>
	);
	return (
		<SidebarContainer {...props}>
			<SidebarLogo>
				<Heading
					color={THEME == 'basic' ? 'inherit' : 'text.dark'}
					size='md'
					fontFamily='Bebas Neue'>
					{title}
				</Heading>
				{closeBtn && closeBtn}
			</SidebarLogo>
			<SidebarContent>{main}</SidebarContent>
		</SidebarContainer>
	);
};

export default Sidebar;
