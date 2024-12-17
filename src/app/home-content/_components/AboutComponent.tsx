import React, { FC } from 'react';
import { Heading, Text } from '@chakra-ui/react';
import { ViewContentContainer, ImageView } from '@/components/library';
import { HomeContentProps } from '.';

const AboutComponent: FC<HomeContentProps> = ({ dataModel, content }) => {
	const { title, subTitle, image } = content?.about;
	return (
		<ViewContentContainer
			title='About Us'
			data={content}
			path='nexa'
			dataModel={dataModel}>
			<ImageView
				src={image}
				direction='row'>
				<Heading size='md'>{title}</Heading>
				<Text
					whiteSpace='pre-line'
					size='md'>
					{subTitle}
				</Text>
			</ImageView>
		</ViewContentContainer>
	);
};

export default AboutComponent;
