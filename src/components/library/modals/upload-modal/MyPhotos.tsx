'use client';
import React from 'react';
import { Flex, Image, useColorModeValue } from '@chakra-ui/react';
import { useGetAllUploadsQuery } from '@/store/services/uploadApi';

const MyPhotos = ({ handleSelect, type = 'image' }: { handleSelect: any; type: string }) => {
	const { data } = useGetAllUploadsQuery({ limit: '999', type, page: 1, sort: '-createdAt' });
	const [selected, setSelected] = React.useState<any>(null);
	const borderColor = useColorModeValue('brand.500', 'brand.200');

	return (
		<Flex
			gap={2}
			flexWrap='wrap'>
			{data?.doc?.map((item: any) => (
				<Flex
					borderRadius='4px'
					onClick={() => {
						setSelected(item?.url);
						handleSelect(item?.url);
					}}
					cursor='pointer'
					key={item._id}
					w='200px'
					h='200px'
					border='2px solid'
					borderColor={selected === item?.url ? borderColor : '#ddd'}
					bg='whitesmoke'>
					<Image
						objectFit='contain'
						src={item?.url}
						alt={item?.name}
					/>
				</Flex>
			))}
		</Flex>
	);
};

export default MyPhotos;
