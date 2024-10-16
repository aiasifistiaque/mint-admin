import React, { FC } from 'react';
import { Heading, Text, Image } from '@chakra-ui/react';
import { ViewContentContainer, Column } from '@/components/library';
import { HomeContentProps } from '.';

const StoreConfig: FC<HomeContentProps> = ({ dataModel, content }) => {
	return (
		<ViewContentContainer
			path='basic'
			title='Store Information'
			data={content}
			dataModel={dataModel}>
			<Column gap={4}>
				<Image
					src={content?.logo}
					w='200px'
					h='auth'
				/>
				<Column gap={2}>
					<Heading size='sm'>Store Name</Heading>
					<Text>{content?.name}</Text>
				</Column>
				<Column gap={2}>
					<Heading size='sm'>Phone</Heading>
					<Text>{content?.phone}</Text>
				</Column>
				<Column gap={2}>
					<Heading size='sm'>Email</Heading>
					<Text>{content?.email}</Text>
				</Column>
			</Column>
		</ViewContentContainer>
	);
};

export default StoreConfig;
