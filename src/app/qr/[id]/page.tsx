'use client';

// import { useGetProductsByQrQuery } from '@/store/services/productsApi';
// import { Heading, Text, Center, Skeleton, Image } from '@chakra-ui/react';
import React from 'react';
// import { useParams } from 'next/navigation';
// import FoodMenuItem from '@/components/menu/FoodMenuItem';
// import { Column, Icon } from '@/components/library';
// import { useGetByIdQuery } from '@/components/library/store/services/commonApi';
// import Link from 'next/link';

// const QrMenuPage = () => {
// 	const { id } = useParams();
// 	const { data, isFetching } = useGetProductsByQrQuery(id);

// 	const { data: restaurant, isFetching: restaurantFetching } = useGetByIdQuery(
// 		{ path: 'restaurant', id: id },
// 		{ skip: !id }
// 	);

// 	return (
// 		<Column
// 			gap={2}
// 			w='full'>
// 			<Center
// 				flexDir='column'
// 				gap={4}
// 				pb='44px'>
// 				{restaurantFetching && !restaurant?.image ? (
// 					<Skeleton
// 						w='200px'
// 						h='200px'
// 						borderRadius='full'
// 					/>
// 				) : (
// 					<Image
// 						alt='Logo'
// 						width={200}
// 						height={200}
// 						objectFit='contain'
// 						src={restaurant?.image}
// 					/>
// 				)}
// 				<Skeleton isLoaded={!restaurantFetching}>
// 					<Heading
// 						size='3xl'
// 						textAlign='center'
// 						fontFamily='Bebas neue'>
// 						{restaurant?.name || 'Restaurant'}
// 					</Heading>
// 				</Skeleton>
// 			</Center>

// 			<Skeleton isLoaded={!isFetching}>
// 				<Heading
// 					size='2xl'
// 					fontFamily='Bebas neue'>
// 					MENU
// 				</Heading>
// 			</Skeleton>

// 			{data &&
// 				data.map((item: any, i: number) => (
// 					<Column
// 						key={i}
// 						py={6}>
// 						<Heading
// 							size='xl'
// 							fontFamily='Bebas neue'>
// 							{item?.category?.name}
// 						</Heading>
// 						<Text color='#555'>
// 							<i>{item?.category?.description}</i>
// 						</Text>
// 						<Column
// 							py={2}
// 							gap={4}>
// 							{item?.items?.map((menu: any, j: number) => (
// 								<FoodMenuItem
// 									key={j}
// 									name={menu?.name}
// 									price={menu?.price}
// 									description={menu?.description}
// 									isDiscounted={menu?.isDiscount}
// 									discountedPrice={menu?.discountPrice}
// 									longDescription={menu?.longDescription}
// 									image={menu?.image}
// 									tags={menu?.tags}
// 									time={menu?.time || 0}
// 								/>
// 							))}
// 						</Column>
// 					</Column>
// 				))}
// 			{!isFetching && (
// 				<Center
// 					flexDir='column'
// 					mt='16px'
// 					p='24px'
// 					gap={4}
// 					borderRadius='8px'>
// 					<Heading
// 						size='lg'
// 						fontFamily='Bebas Neue'>
// 						{`We'd love your feedback`}
// 					</Heading>
// 					<Icon
// 						size={64}
// 						name='feedback'
// 					/>
// 					<Link
// 						href={`/user-feedback/${id}`}
// 						style={{ color: 'dodgerblue', textDecorationLine: 'underline' }}>
// 						<i>Send us your Feedback</i>
// 					</Link>
// 				</Center>
// 			)}
// 		</Column>
// 	);
// };

// export default QrMenuPage;

const page = () => {
	return <div>page</div>;
};

export default page;
