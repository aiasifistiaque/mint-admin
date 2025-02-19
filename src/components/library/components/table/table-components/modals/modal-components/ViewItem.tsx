import React, { FC, ReactNode, useEffect } from 'react';
import {
	Badge,
	Box,
	Flex,
	Grid,
	GridProps,
	Heading,
	Link,
	LinkProps,
	Skeleton,
	Tag,
	TagLabel,
	Text,
	TextProps,
	Tooltip,
	useClipboard,
} from '@chakra-ui/react';
import { Align, Column, Icon, ImageContainer, PLACEHOLDER_IMAGE, RenderTag } from '../../../../..';

type ViewItemProps = GridProps & {
	title: string;
	type?: string;
	children?: ReactNode;
	colorScheme?: any;
	path?: string;
	isLoading?: boolean;
	copy?: boolean;
};

const renderContent = ({ type, children, colorScheme, path }: any) => {
	switch (type) {
		case 'custom-section-array':
			return (
				<Flex
					flexWrap='wrap'
					gap={4}
					alignItems='center'>
					{children?.map((item: any, i: number) => (
						<Column
							gap={2}
							key={i}>
							<Heading size='xs'>{item?.title}</Heading>
							<Text fontSize='.9rem'>{item?.description}</Text>
						</Column>
					))}
				</Flex>
			);
		case 'data-tag':
			return (
				<Align
					flexWrap='wrap'
					gap={2}>
					{children?.map((item: any, i: number) => (
						<RenderTag
							key={i}
							path={path || ''}
							item={item}
						/>
					))}
				</Align>
			);
		case 'array-tag':
			return (
				<Align
					flexWrap='wrap'
					gap={2}>
					{children?.map((item: any, i: number) => (
						<Badge
							colorScheme='purple'
							variant='subtle'
							key={i}>
							{item?.toString()}
						</Badge>
					))}
				</Align>
			);
		case 'external-link':
			if (!children) return null;
			return (
				<Flex gap={2}>
					<Link
						{...textCss}
						color='dodgerblue'
						cursor='pointer'
						href={children || '#'}
						isExternal={children ? true : false}>
						{children}
					</Link>
				</Flex>
			);
		case 'file':
			if (!children) return null;
			return (
				<Flex gap={2}>
					<Link
						cursor='pointer'
						href={children || '#'}
						isExternal={children ? true : false}>
						<Tag
							size='md'
							colorScheme='gray'>
							<TagLabel mr={1}>Download File</TagLabel>
							<Icon
								name='download'
								size={16}
							/>
						</Tag>
					</Link>
				</Flex>
			);
		case 'data-array-tag':
			return (
				<Align
					flexWrap='wrap'
					gap={2}>
					{Array.isArray(children) &&
						children?.map((item: any, i: number) => (
							<RenderTag
								key={i}
								path={path || ''}
								item={item}
							/>
						))}
				</Align>
			);

		case 'tag':
			return (
				<Flex
					alignItems='center'
					flexWrap='wrap'
					gap={2}>
					{Array.isArray(children)
						? children.map((item: any, i: number) => (
								<Badge
									colorScheme='purple'
									variant='subtle'
									key={i}>
									{item?.toString()}
								</Badge>
						  ))
						: children && (
								<Badge colorScheme={colorScheme ? colorScheme(children) : 'gray'}>
									{children?.toString()}
								</Badge>
						  )}
				</Flex>
			);
		case 'checkbox':
			return (
				<Box alignItems='center'>
					{children && (
						<Badge colorScheme={colorScheme ? colorScheme(children) : 'gray'}>
							{children?.toString()}
						</Badge>
					)}
				</Box>
			);
		case 'custom-attribute':
			return (
				<Box alignItems='center'>
					<Column gap={2}>
						{children &&
							children?.length > 0 &&
							children?.map(({ label, value }: any, i: number) => (
								<Grid
									alignItems='center'
									gridTemplateColumns='1fr 2fr'
									key={i}>
									<Heading size='xs'>{label}:</Heading>
									<Text fontSize='.8rem'>{value}</Text>
								</Grid>
							))}
					</Column>
				</Box>
			);
		case 'image':
			return <ImageContainer src={children || PLACEHOLDER_IMAGE} />;
		case 'image-array':
			return (
				<Align
					flexWrap='wrap'
					gap={2}>
					{children?.map((item: string, i: number) => (
						<ImageContainer
							key={i}
							src={item || PLACEHOLDER_IMAGE}
							size={100}
						/>
					))}
				</Align>
			);
		case 'date':
			return <Text {...textCss}>{children?.toLocaleString()}</Text>;
		default:
			return <Text {...textCss}>{children}</Text>;
	}
};

const textCss: TextProps & LinkProps = {
	fontSize: '.95rem',
	wordBreak: 'break-all',
};

const ViewItem: FC<ViewItemProps> = ({
	title,
	type,
	children,
	colorScheme,
	path,
	copy,
	isLoading = false,
	...props
}) => {
	const { onCopy, value, setValue, hasCopied } = useClipboard('');

	useEffect(() => {
		if (children && copy) {
			setValue(children.toString());
		}
	}, [children]);

	return (
		<GridContainer
			{...props}
			gridTemplateColumns={{ base: '1fr', md: type == 'textarea' ? '1fr' : '2fr 3fr' }}
			gap={{ base: '8px', md: type == 'textarea' ? '12px' : '32px' }}>
			<SkeletonContent isLoading={isLoading}>
				<Heading size='xs'>{title}:</Heading>
			</SkeletonContent>
			<SkeletonContent isLoading={isLoading}>
				<Flex
					gap={2}
					align='center'>
					{!isLoading &&
						children &&
						renderContent({ type, children, colorScheme, path, isLoading })}
					{copy && children && children != 'n/a' && (
						<Tooltip
							label={hasCopied ? 'Copied!' : 'Copy'}
							aria-label='Copy'>
							<Flex
								onClick={onCopy}
								cursor='pointer'>
								<Icon name='copy' />
							</Flex>
						</Tooltip>
					)}
				</Flex>
			</SkeletonContent>
		</GridContainer>
	);
};

const GridContainer = ({ children, ...props }: GridProps & { children: ReactNode }) => (
	<Grid
		justifyContent='center'
		px={{ base: 4, md: 6 }}
		pb={2}
		gridTemplateColumns='2fr 3fr'
		gap='32px'
		borderBottomWidth={1}
		borderColor='border.light'
		_dark={{ borderColor: 'border.dark' }}
		_last={{ borderBottomWidth: 0 }}
		{...props}>
		{children}
	</Grid>
);

const SkeletonContent = ({ isLoading, children }: { isLoading: boolean; children: ReactNode }) => (
	<Skeleton
		isLoaded={!isLoading}
		height={isLoading ? '20px' : 'auto'}
		width={isLoading ? '100px' : 'full'}>
		{children}
	</Skeleton>
);

export default ViewItem;
