import React from 'react';
import { Image, Flex, Center } from '@chakra-ui/react';

const FoodMenuImage = ({ src }: { src: any }) => {
	if (!src) return null;
	return (
		<Center
			bg='#f8f6f3'
			w='full'
			h='200px'>
			<Image
				borderRadius={8}
				pb={8}
				w='full'
				h='200px'
				objectFit='contain'
				src={src}
			/>
		</Center>
	);
};

export default FoodMenuImage;
