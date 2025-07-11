import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import { radius, shadow } from '../../../../../config';
import { SpaceBetween } from '../../../../../containers';

const SelectedItemsContainer = ({ children }: { children: ReactNode }) => {
	return (
		<Flex
			p={2}
			pb={0}
			px={0}
			w='full'
			py={1}>
			<SpaceBetween
				p={2}
				py={1}
				pr={1}
				w='full'
				borderRadius={radius?.SELECT_CONTAINER}
				bg='table.bg.light'
				border='1px solid'
				borderColor='table.innerBorder.light'
				color='gray.600'
				fontWeight='600'
				boxShadow={shadow.DASH}
				_dark={{
					bg: 'table.bg.dark',
					borderColor: 'table.innerBorder.dark',
					color: 'gray.200',
				}}>
				{children}
			</SpaceBetween>
		</Flex>
	);
};

export default SelectedItemsContainer;
