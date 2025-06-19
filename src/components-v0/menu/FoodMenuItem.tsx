import React, { FC } from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import FoodMenuModal from './FoodMenuModal';
import CookingTime from './CookingTime';
import { FoodMenuBadge, FoodMenuBadgeContainer, FoodMenuDiscountText } from './menu-components';

type FoodMenuItemProps = {
	name: string;
	price: number;
	description: string;
	isDiscounted?: boolean;
	discountedPrice?: number;
	longDescription: string;
	image: string;
	tags: string[];
	time: number;
};

const FoodMenuItem: FC<FoodMenuItemProps> = ({
	name,
	price,
	description,
	isDiscounted,
	discountedPrice,
	longDescription,
	image,
	tags,
	time,
}) => {
	return (
		<FoodMenuModal
			name={name}
			tags={tags}
			price={price}
			image={image}
			description={longDescription || description}
			isDiscounted={isDiscounted}
			time={time}
			discountedPrice={discountedPrice}>
			<Flex
				w='full'
				justify='space-between'
				align='flex-end'>
				<Heading
					size='sm'
					fontSize='20px'>
					{name}
				</Heading>

				<Flex
					gap={3}
					align='flex-end'>
					<FoodMenuDiscountText show={isDiscounted}>BDT. {price}</FoodMenuDiscountText>

					<Heading
						fontFamily='Bebas neue'
						size='md'>
						BDT. {isDiscounted ? discountedPrice : price}
					</Heading>
				</Flex>
			</Flex>
			<CookingTime>{time}</CookingTime>
			<Text
				noOfLines={3}
				fontSize='14px'>
				{description}
			</Text>
			{tags && tags?.length > 0 && (
				<FoodMenuBadgeContainer>
					{tags?.map((tag: string, i: number) => (
						<FoodMenuBadge key={i}>{tag}</FoodMenuBadge>
					))}
				</FoodMenuBadgeContainer>
			)}
		</FoodMenuModal>
	);
};

export default FoodMenuItem;
