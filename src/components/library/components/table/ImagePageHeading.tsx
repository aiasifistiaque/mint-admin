import { Flex, FlexProps, Text, Skeleton, Breadcrumb } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

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
					<Skeleton
						height='40px'
						width='300px'
					/>
				) : (
					<Breadcrumb.Root>
						<Breadcrumb.List>
							<Breadcrumb.Item>
								<Breadcrumb.Link
									asChild
									{...headingCss}>
									<Link href={folder ? '/images' : '#'}>{title}</Link>
								</Breadcrumb.Link>
							</Breadcrumb.Item>

							{folderData?.parent && (
								<>
									<Breadcrumb.Separator />
									<Breadcrumb.Item>
										<Breadcrumb.Link
											asChild
											{...headingCss}
											{...(!folder && { 'aria-current': 'page' })}>
											<Link href={`/images/f/${folderData?.parent?._id}`}>
												{folderData?.parent?.name}
											</Link>
										</Breadcrumb.Link>
									</Breadcrumb.Item>
								</>
							)}

							{folderData && (
								<>
									<Breadcrumb.Separator />
									<Breadcrumb.Item>
										<Breadcrumb.Link
											asChild
											{...headingCss}
											aria-current='page'>
											<Link href='#'>{folderData?.name}</Link>
										</Breadcrumb.Link>
									</Breadcrumb.Item>
								</>
							)}
						</Breadcrumb.List>
					</Breadcrumb.Root>
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
