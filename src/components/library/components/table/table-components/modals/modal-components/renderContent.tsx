import { Flex, Badge, Text, Link, Tag, TagLabel, Box } from '@chakra-ui/react';
import { TextProps, LinkProps, Grid, Heading } from '@chakra-ui/react';
import { Column, Align, RenderTag, Icon, FullScreenImage } from '../../../../../';
import JSONDisplay from './JSONDisplay';
import { PLACEHOLDER_IMAGE, ImageContainer } from '../../../../../';

const textCss: TextProps & LinkProps = {
	fontSize: '.95rem',
	wordBreak: 'break-all',
	whiteSpace: 'normal',
	overflow: 'hidden',
};

const renderContent = ({ type, children, colorScheme, path }: any) => {
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
						cursor='pointer'
						href={children || '#'}
						isExternal={children ? true : false}>
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
		case 'date':
			return <Text {...textCss}>{children?.toLocaleString()}</Text>;
		default:
			return <Text {...textCss}>{children}</Text>;
	}
};

export default renderContent;
