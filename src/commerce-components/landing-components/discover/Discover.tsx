import { BgImage, ColRow, Column, SubHeading, Title, Button, sizes } from '../..';
import React, { FC } from 'react';
import { Grid, Box } from '@chakra-ui/react';

const DiscoverItem = ({ src, btn, href }: { src: string; btn: string; href: string }) => {
	return (
		<BgImage
			src={src}
			h='400px'
			p='32px'
			align='flex-end'
			justify='center'
			borderRadius={sizes.RADIUS}>
			<>
				<Button
					w='150px'
					href={href}
					variant='secondary'>
					{btn}
				</Button>
			</>
		</BgImage>
	);
};

const Discover: FC<{ title: string; subTitle: string; items: any[] }> = ({
	title,
	subTitle,
	items,
}) => {
	const renderItems = items.map((item, i: number) => (
		<DiscoverItem
			{...item}
			key={i}
		/>
	));
	return (
		<Column gap={16}>
			<Column
				textAlign='center'
				w={{ base: 'full', md: '60%' }}
				mx='auto'
				gap={8}>
				<SubHeading>{subTitle}</SubHeading>
				<Title type='h3'>{title}</Title>
			</Column>
			<Grid
				gap={8}
				gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}>
				{renderItems}
			</Grid>
		</Column>
	);
};

export default Discover;
