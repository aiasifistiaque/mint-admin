'use client';

import React, { FC } from 'react';
import { Column, SubHeading, Title, sizes } from '../../..';
import { Image } from '@chakra-ui/react';

const IMAGE_SIZE = { base: '100%', md: '100%', lg: '100%' };

const CategoryCard: FC<{ name: string; qty: number; src: string }> = ({ name, qty, src }) => {
	return (
		<Column
			pb={8}
			pt={4}
			userSelect='none'
			w='full'
			gap={4}>
			<Image
				src={src}
				alt='name'
				objectFit='cover'
				width={IMAGE_SIZE}
				height={sizes.CATEGORY_CARD_HEIGHT}
				borderRadius={sizes.RADIUS}
			/>
			<Column>
				<Title type='h6'>{name}</Title>
				<SubHeading fontSize='1.1rem'>{qty} products</SubHeading>
			</Column>
		</Column>
	);
};

export default CategoryCard;
