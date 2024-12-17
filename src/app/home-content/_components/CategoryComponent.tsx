import React, { FC } from 'react';
import { Heading, Text, Flex, Image } from '@chakra-ui/react';
import {
	ViewContentContainer,
	Column,
	Align,
	Button,
	useGetItemNameById,
	PLACEHOLDER_IMAGE,
} from '../../../components/library';

type HeroDataProps = {
	content: any;
	dataModel: any;
};

const CategoryComponent: FC<HeroDataProps> = ({ content, dataModel }) => {
	return (
		<ViewContentContainer
			title='Category Section'
			data={content}
			path='nexa'
			dataModel={dataModel}>
			<Align
				justify='space-between'
				w='full'>
				<Column>
					<Heading size='md'>{content?.collections?.title}</Heading>
					<Text size='md'>{content?.collections?.subTitle}</Text>
				</Column>

				<Button size='xs'>{content?.collections?.btnText}</Button>
			</Align>
			<Flex
				flexWrap='wrap'
				gap={4}>
				{content?.collections?.items?.length <= 0 && <Text>No items found</Text>}
				{content?.collections?.items?.map((item: any, i: number) => (
					<GetItem
						key={i}
						path={item?.type}
						id={item?.id}
					/>
				))}
			</Flex>
		</ViewContentContainer>
	);
};

const GetItem = ({ path, id }: { path: string; id: string }) => {
	const { name, image } = useGetItemNameById({
		id,
		path,
	});

	return (
		<Column w='100px'>
			<Image
				src={image || PLACEHOLDER_IMAGE}
				h='100px'
				w='100px'
			/>
			<Text>{name || 'processing...'}</Text>
		</Column>
	);
};

export default CategoryComponent;
