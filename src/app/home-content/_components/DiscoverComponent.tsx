import React, { FC } from 'react';
import { Box, Center, Grid, Heading, Text } from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { ViewContentContainer, ImageView } from '@/components/library';
import { HomeContentProps } from '.';

const DiscoverComponent: FC<HomeContentProps> = ({ dataModel, content }) => {
	const { title, subTitle, items } = content?.discover;
	return (
		<ViewContentContainer
			title='Discover'
			data={content}
			path='nexa'
			dataModel={dataModel}>
			<Center
				flexDir='column'
				textAlign='center'>
				<Text size='md'>{subTitle}</Text>
				<Heading size='lg'>{title}</Heading>
			</Center>
			<Grid
				gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
				gap={6}>
				<ImageView src={items[0]?.image}>
					<Box>
						<Button>{items[0]?.btnText}</Button>
					</Box>
				</ImageView>
				<ImageView src={items[1]?.image}>
					<Box>
						<Button>{items[1]?.btnText}</Button>
					</Box>
				</ImageView>
			</Grid>
		</ViewContentContainer>
	);
};

export default DiscoverComponent;
