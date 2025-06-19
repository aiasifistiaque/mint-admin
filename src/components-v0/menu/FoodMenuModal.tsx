import React, { FC } from 'react';

import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	useDisclosure,
	Flex,
	Text,
	Heading,
	CloseButton,
} from '@chakra-ui/react';
import Column from '../library/containers/Column';
import { useSwipeable } from 'react-swipeable';
import { SpaceBetween } from '@/components/library';
import CookingTime from './CookingTime';
import {
	FoodMenuBadge,
	FoodMenuBadgeContainer,
	FoodMenuDiscountText,
	FoodMenuDrawerContent,
	FoodMenuImage,
	FoodMenuTopBar,
	FoodMenuTrigger,
} from './menu-components';

type FoodMenuItemProps = {
	name: string;
	price: number;
	description: string;
	isDiscounted?: boolean;
	discountedPrice?: number;
	image?: string;
	tags: string[];
	children: React.ReactNode;
	time: number;
};

const FoodMenuModal: FC<FoodMenuItemProps> = props => {
	const { tags, image, name, price, description, discountedPrice, isDiscounted, children, time } =
		props;

	const { isOpen, onOpen, onClose } = useDisclosure();

	const handlers = useSwipeable({
		onSwipedDown: () => {
			onClose();
		},
	});

	return (
		<>
			<FoodMenuTrigger onClick={onOpen}>{children}</FoodMenuTrigger>

			<Drawer
				isFullHeight={false}
				placement='bottom'
				isOpen={isOpen}
				onClose={onClose}>
				<DrawerOverlay />
				<FoodMenuDrawerContent>
					<DrawerHeader
						fontFamily='Bebas Neue'
						{...handlers}>
						<FoodMenuTopBar />
						<SpaceBetween>
							<Heading
								size='lg'
								pt={4}>
								{name}
							</Heading>
							<CloseButton onClick={onClose} />
						</SpaceBetween>
					</DrawerHeader>

					<DrawerBody>
						<Column gap={2}>
							<FoodMenuImage src={image} />
							<CookingTime>{time}</CookingTime>
							<Text>{description}</Text>
							{tags && tags?.length > 0 && (
								<FoodMenuBadgeContainer>
									{tags?.map((tag: string, i) => (
										<FoodMenuBadge key={i}>{tag}</FoodMenuBadge>
									))}
								</FoodMenuBadgeContainer>
							)}
						</Column>
					</DrawerBody>

					<DrawerFooter>
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
					</DrawerFooter>
				</FoodMenuDrawerContent>
			</Drawer>
		</>
	);
};

export default FoodMenuModal;
