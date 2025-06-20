'use client';
import { FlexProps, Heading, Stack } from '@chakra-ui/react';
import { ReactNode, FC } from 'react';
import SidebarItem from './SidebarItem';

import { sidebarData as sidebar, useGetQuery, useGetSelfQuery } from '../..';

import { SidebarBody, SidebarContainer, SidebarHeading, SidebarLogo } from './sidebar-components';
import Link from 'next/link';

const Sidebar: FC<FlexProps & { closeBtn?: ReactNode }> = ({ closeBtn, ...props }) => {
	const { data } = useGetSelfQuery({});
	const { data: sidebarData, isFetching, isError } = useGetQuery({ path: `/sidebar/crm/page` });

	const title = data?.shop?.name || process.env.NEXT_PUBLIC_STORE_NAME || 'Admin';

	const main =
		isFetching || !sidebarData
			? sidebar.map((item, i) => (
					<Stack key={i}>
						<SidebarHeading
							isLoading={isFetching || !sidebarData}
							show={item?.startOfSection}>
							{item?.sectionTitle}
						</SidebarHeading>
						<Link href={item?.href}>
							<SidebarItem
								isLoading={isFetching || !sidebarData}
								href={item?.href}
								path={item?.path}
								icon={item?.icon}>
								{item?.title}
							</SidebarItem>
						</Link>
					</Stack>
			  ))
			: sidebarData.map((item: any, i: number) => (
					<Stack key={i}>
						<SidebarHeading
							isLoading={false}
							show={item?.startOfSection}>
							{item?.sectionTitle}
						</SidebarHeading>
						<Link href={item?.href}>
							<SidebarItem
								isLoading={false}
								href={item?.href}
								path={item?.path}
								icon={item?.icon}>
								{item?.title}
							</SidebarItem>
						</Link>
					</Stack>
			  ));
	return (
		<>
			<SidebarLogo>
				<Heading
					color='sidebar.headerText.light'
					_dark={{ color: 'sidebar.headerText.dark' }}
					size='md'
					fontFamily='Bebas Neue'>
					{title}
				</Heading>
				{closeBtn && closeBtn}
			</SidebarLogo>
			<SidebarContainer {...props}>
				<SidebarBody>{main}</SidebarBody>
			</SidebarContainer>
		</>
	);
};

export default Sidebar;
