import { Flex, FlexProps, Text, SkeletonText } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { Breadcrumb, BreadcrumbItem } from '@chakra-ui/react';

import { containerCss, subHeadingCss, wrapperCss } from './style';
import { useGetByIdQuery } from '../../store';

type PageHeadingProps = FlexProps & {
	title: string;
	button?: string;
	href?: string;
	isModal?: boolean;
	path: string;
	data?: any;
	export?: boolean;
	table: any;
	isLoading?: boolean;
	folder?: string;
};

const ImagePageHeading: React.FC<PageHeadingProps> = ({
	title,
	href,
	button,
	isModal = false,
	path,
	table,
	data,
	isLoading = false,
	folder,
	export: exportData,
	...props
}) => {
	const { data: folderData } = useGetByIdQuery({ path: 'folders', id: folder }, { skip: !folder });

	return (
		<Flex
			{...wrapperCss}
			{...props}>
			<Flex {...containerCss}>
				{isLoading ? (
					<SkeletonText
						noOfLines={3}
						w='300px'
						h='40px'
					/>
				) : (
					<Breadcrumb>
						<BreadcrumbItem {...headingCss}>
							<Link href={folder ? '/images' : '#'}>{title}</Link>
						</BreadcrumbItem>
						{folderData?.parent && (
							<BreadcrumbItem
								{...headingCss}
								isCurrentPage={!folder}>
								<Link href={`/images/f/${folderData?.parent?._id}`}>
									{folderData?.parent?.name}
								</Link>
							</BreadcrumbItem>
						)}
						{folderData && (
							<BreadcrumbItem
								isCurrentPage={true}
								{...headingCss}>
								<Link href='#'>{folderData?.name}</Link>
							</BreadcrumbItem>
						)}
					</Breadcrumb>
				)}
			</Flex>
		</Flex>
	);
};

const crumbCss: any = {
	fontSize: '14px',
	fontWeight: '400',
	textTransform: 'capitalize',
	_last: { fontWeight: '500' },
};

const headingCss: any = {
	fontSize: { base: '1.1rem', md: '1.5rem' },
	fontWeight: '500',
};

export default ImagePageHeading;
