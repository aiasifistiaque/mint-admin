import { FC, ReactNode, useEffect } from 'react';
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
import {
	Align,
	Column,
	Icon,
	ImageContainer,
	PLACEHOLDER_IMAGE,
	RenderTag,
	FullScreenImage,
	ViewItemModal,
} from '../../../../..';
import JSONDisplay from './JSONDisplay';

type ViewItemProps = GridProps & {
	title: string;
	type?: string;
	children?: ReactNode;
	colorPalette?: any;
	path?: string;
	isLoading?: boolean;
	copy?: boolean;
};

const renderContent = ({ type, children, colorPalette, path }: any) => {
	switch (type) {
		case 'section-data-array':
			return (
				<Flex
					flexWrap='wrap'
					gap={4}
					alignItems='center'>
					{children?.map((item: any, i: number) => (
						<Flex
							p={3}
							flexWrap='wrap'
							borderWidth={1}
							borderRadius={8}
							gap={4}
							key={i}>
							<JSONDisplay jsonData={item} />
						</Flex>
					))}
				</Flex>
			);
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
							colorPalette='purple'
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
						cursor='pointer'
						href={children || '#'}
						{...(children ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
						<Flex
							align='center'
							gap={2}>
							<Text
								{...textCss}
								color='dodgerblue'>
								{children}
							</Text>
							<Icon
								name='external-link'
								size={16}
							/>
						</Flex>
					</Link>
				</Flex>
			);
		case 'file':
			if (!children || children == '--') return null;
			return (
				<Flex gap={2}>
					<Link
						cursor='pointer'
						href={children || '#'}
						{...(children ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
						<Tag.Root
							size='md'
							colorPalette='gray'>
							<Tag.Label mr={1}>Download File</Tag.Label>
							<Icon
								name='download'
								size={16}
							/>
						</Tag.Root>
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
									colorPalette='purple'
									variant='subtle'
									key={i}>
									{item?.toString()}
								</Badge>
						  ))
						: children && (
								<Badge colorPalette={colorPalette ? colorPalette(children) : 'gray'}>
									{children?.toString()}
								</Badge>
						  )}
				</Flex>
			);
		case 'checkbox':
			return (
				<Box alignItems='center'>
					{children && (
						<Badge colorPalette={colorPalette ? colorPalette(children) : 'gray'}>
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
			return (
				<FullScreenImage src={children || PLACEHOLDER_IMAGE}>
					<ImageContainer
						size={300}
						src={children || PLACEHOLDER_IMAGE}
					/>
				</FullScreenImage>
			);
		case 'image-array':
			return (
				<Align
					flexWrap='wrap'
					gap={2}>
					{children?.map((item: string, i: number) => (
						<FullScreenImage
							src={item || PLACEHOLDER_IMAGE}
							key={i}>
							<ImageContainer
								key={i}
								src={item || PLACEHOLDER_IMAGE}
								size={100}
							/>
						</FullScreenImage>
					))}
				</Align>
			);
		case 'basic-editor':
			return (
				<Text
					dangerouslySetInnerHTML={children}
					{...textCss}
				/>
			);
		case 'editor':
			return (
				<Text
					dangerouslySetInnerHTML={children}
					{...textCss}
				/>
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
	whiteSpace: 'normal',
	overflow: 'hidden',
};

const ViewItem: FC<ViewItemProps> = ({
	title,
	type,
	children,
	colorPalette,
	path,
	copy,
	isLoading = false,
	...props
}) => {
	const { copy: onCopy, value, setValue, copied: hasCopied } = useClipboard();

	useEffect(() => {
		if (children && copy) {
			setValue(children.toString());
		}
	}, [children]);

	return (
		<GridContainer
			{...props}
			gridTemplateColumns={{
				base: '1fr',
				md:
					type == 'textarea' || type == 'editor' || type == 'section-data-array'
						? '1fr'
						: '2fr 3fr',
			}}
			gap={{
				base: 2,
				md: type == 'textarea' || type == 'editor' || type == 'section-data-array' ? 3 : 8,
			}}>
			<SkeletonContent isLoading={isLoading}>
				<Heading size='xs'>{title}:</Heading>
			</SkeletonContent>
			<SkeletonContent isLoading={isLoading}>
				<Flex
					gap={2}
					align='center'>
					{!isLoading &&
						children &&
						renderContent({ type, children, colorPalette, path, isLoading })}
					{copy && children && children != 'n/a' && (
						<Tooltip.Root>
							<Tooltip.Trigger asChild>
								<Flex
									onClick={onCopy}
									cursor='pointer'>
									<Icon name='copy' />
								</Flex>
							</Tooltip.Trigger>
							<Tooltip.Positioner>
								<Tooltip.Content>{hasCopied ? 'Copied!' : 'Copy'}</Tooltip.Content>
							</Tooltip.Positioner>
						</Tooltip.Root>
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
		loading={isLoading}
		height={isLoading ? '20px' : 'auto'}
		width={isLoading ? '100px' : 'full'}>
		{children}
	</Skeleton>
);

export default ViewItem;
