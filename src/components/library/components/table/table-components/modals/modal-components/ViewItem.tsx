import React, { FC, ReactNode } from 'react';
import {
	Badge,
	Box,
	Center,
	Flex,
	Grid,
	GridProps,
	Heading,
	Image,
	Skeleton,
	Text,
} from '@chakra-ui/react';
import { Align, Column, ImageContainer, PLACEHOLDER_IMAGE, RenderTag } from '../../../../..';

type ViewItemProps = GridProps & {
	title: string;
	type?: string;
	children: string | boolean | number | Date;
	colorScheme?: any;
	path?: string;
	isLoading?: boolean;
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
		case 'data-array-tag':
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

		case 'tag':
			return (
				<Box alignItems='center'>
					{children && (
						<Badge colorScheme={colorScheme ? colorScheme(children) : 'gray'}>
							{children?.toString()}
						</Badge>
					)}
				</Box>
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
			return (
				<Text
					wordBreak='break-all'
					fontSize='.95rem'>
					{children?.toLocaleString()}
				</Text>
			);
		default:
			return (
				<Text
					wordBreak='break-all'
					fontSize='.95rem'>
					{children}
				</Text>
			);
	}
};

const SkeletonContent = ({ isLoading, children }: { isLoading: boolean; children: ReactNode }) => (
	<Skeleton
		isLoaded={!isLoading}
		height={isLoading ? '20px' : 'auto'}
		width={isLoading ? '100px' : 'full'}>
		{children}
	</Skeleton>
);

const GridContainer = ({ children }: GridProps & { children: ReactNode }) => (
	<Grid
		justifyContent='center'
		px={6}
		pb={2}
		gridTemplateColumns='2fr 3fr'
		gap='32px'
		borderBottomWidth={1}
		borderColor='border.light'
		_dark={{ borderColor: 'border.dark' }}
		_last={{ borderBottomWidth: 0 }}>
		{children}
	</Grid>
);

const ViewItem: FC<ViewItemProps> = ({
	title,
	type,
	children,
	colorScheme,
	path,
	isLoading = false,
	...props
}) => {
	return (
		<GridContainer {...props}>
			<SkeletonContent isLoading={isLoading}>
				<Heading size='xs'>{title}:</Heading>
			</SkeletonContent>
			<SkeletonContent isLoading={isLoading}>
				{!isLoading && renderContent({ type, children, colorScheme, path, isLoading })}
			</SkeletonContent>
		</GridContainer>
	);
};

export default ViewItem;
