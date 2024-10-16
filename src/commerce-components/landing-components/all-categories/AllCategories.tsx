'use client';
import { ColRow, FlexChild, SubHeading, Title, PrimaryButton, Column } from '../..';
import React, { FC } from 'react';
import { CategoryCard, CategoryCardContainer } from '.';

const SRC =
	'https://nexa-clothing.myshopify.com/cdn/shop/files/main-banner-four.png?v=1722417191&width=3840';

const cardData = [
	{
		name: 'Long Sleeves',
		qty: 10,
		src: 'https://nexa-clothing.myshopify.com/cdn/shop/collections/collections-img-short-sleeves.png?v=1721919414&width=460',
	},
	{
		name: 'Short Sleeves',
		qty: 4,
		src: 'https://nexa-clothing.myshopify.com/cdn/shop/collections/collection-full-sleeves.png?v=1721919381&width=460',
	},
	{
		name: 'Hoodies',
		qty: 8,
		src: 'https://images.unsplash.com/photo-1506638794690-bbea5c6f0ab7?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
	{
		name: 'Sweatshirts',
		qty: 3,
		src: 'https://nexa-clothing.myshopify.com/cdn/shop/collections/collection-img-yoga-set.png?v=1721919483&width=460',
	},
	{
		name: 'Jackets',
		qty: 9,
		src: 'https://images.unsplash.com/photo-1708512151336-7d23ecbe2191?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
	{
		name: 'Pants',
		qty: 12,
		src: 'https://nexa-clothing.myshopify.com/cdn/shop/files/S949a7eb4182647b29f2497eadece525ar.webp?v=1723558526&width=460',
	},
	{
		name: 'Shorts',
		qty: 22,
		src: 'https://images.unsplash.com/photo-1591258370467-f1ca1d70ea8f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
	{
		name: 'Shoes',
		qty: 32,
		src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
	{
		name: 'Accessories',
		qty: 12,
		src: 'https://images.unsplash.com/photo-1564595016712-175004de04ff?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
	{
		name: 'Sports tops',
		qty: 5,
		src: 'https://plus.unsplash.com/premium_photo-1682123593812-1047a154f53b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BvcnRzJTIwd2VhcnxlbnwwfHwwfHx8MA%3D%3D',
	},
];

const TopContainer: FC<FlexChild> = ({ children }) => (
	<ColRow
		gap={6}
		justify='center'
		align='center'>
		{children}
	</ColRow>
);

const AllCategories = () => {
	const renderCategoryCards = cardData.map((item: any, i: number) => (
		<CategoryCard
			src={item.src}
			name={item.name}
			qty={item.qty}
			key={i}
		/>
	));
	return (
		<Column>
			<TopContainer>
				<Column
					w='full'
					gap={4}
					textAlign={{ base: 'center', md: 'left' }}>
					<Title type='h4'>Discover Every Style</Title>
					<SubHeading>Unveil your distinct style today.</SubHeading>
				</Column>
				<PrimaryButton px={4}>View All Collections</PrimaryButton>
			</TopContainer>
			<CategoryCardContainer data={cardData}>{renderCategoryCards}</CategoryCardContainer>
		</Column>
	);
};

export default AllCategories;
