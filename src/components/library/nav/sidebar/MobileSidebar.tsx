'use client';
import {
	Flex,
	FlexProps,
	Grid,
	GridItem,
	TextProps,
	Skeleton,
	Stack,
	Text,
} from '@chakra-ui/react';
import { ReactNode, FC } from 'react';
import SidebarItem from './SidebarItem';

import { sidebarData as sidebar, useGetQuery, useGetSelfQuery } from '../..';

import { SidebarBody, SidebarContainer, SidebarLogo } from './sidebar-components';
import Link from 'next/link';
import MobileSidebarItem from './MobileSidebarItem';

const MobileSidebar: FC<FlexProps & { closeBtn?: ReactNode }> = ({ closeBtn, ...props }) => {
	const sidebarType = process.env.NEXT_PUBLIC_SIDEBAR_TYPE || 'generic';

	const { data } = useGetSelfQuery({});
	const {
		data: sidebarData,
		isFetching,
		isError,
	} = useGetQuery({ path: `/sidebar/crm/${sidebarType}` });

	const title = data?.shop?.name || process.env.NEXT_PUBLIC_STORE_NAME || 'Admin';

	const main =
		isFetching || !sidebarData
			? sidebar.map((item, i) => (
					<>
						<SidebarHeading
							key={`heading-${i}`}
							isLoading={isFetching || !sidebarData}
							show={item?.startOfSection}>
							{item?.sectionTitle}
						</SidebarHeading>

						<GridItem key={`item-${i}`}>
							<Link href={item?.href}>
								<MobileSidebarItem
									isLoading={isFetching || !sidebarData}
									href={item?.href}
									path={item?.path}
									icon={item?.icon}>
									{item?.title}
								</MobileSidebarItem>
							</Link>
						</GridItem>
					</>
			  ))
			: sidebarData.map((item: any, i: number) => (
					<>
						<SidebarHeading
							key={`heading-${i}`}
							isLoading={false}
							show={item?.startOfSection}>
							{item?.sectionTitle}
						</SidebarHeading>
						<GridItem key={`item-${i}`}>
							<Link href={item?.href}>
								<MobileSidebarItem
									isLoading={false}
									href={item?.href}
									path={item?.path}
									icon={item?.icon}>
									{item?.title}
								</MobileSidebarItem>
							</Link>
						</GridItem>
					</>
			  ));
	return (
		<>
			<Flex
				px={4}
				w='full'
				pt='16px'
				pb='84px'
				bg='sidebar.light'
				_dark={{ bg: 'sidebar.dark' }}
				flexDir='column'
				overflow='scroll'>
				<Grid
					gridTemplateColumns='1fr 1fr'
					gap={2}>
					{main}
				</Grid>
			</Flex>
		</>
	);
};

type SidebarHeadingProps = TextProps & {
	children: any;
	show: boolean | undefined;
	isLoading?: boolean;
};

const SidebarHeading: FC<SidebarHeadingProps> = ({
	children,
	isLoading = false,
	show = false,
	...props
}) => {
	if (!show) return null;
	return (
		<GridItem colSpan={2}>
			<Skeleton
				loading={isLoading}
				px={2}
				mt={4}
				h='20px'
				borderRadius='90px'>
				<Text
					color='sidebar.bodyText.headingLight'
					_dark={{ color: 'sidebar.bodyText.headingDark' }}
					fontSize={{ base: 'md', md: '2xs' }}
					fontWeight='700'
					textTransform='uppercase'
					{...props}>
					{children}
				</Text>
			</Skeleton>
		</GridItem>
	);
};

export default MobileSidebar;
