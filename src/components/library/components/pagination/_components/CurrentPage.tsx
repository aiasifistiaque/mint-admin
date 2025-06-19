import { Center } from '@chakra-ui/react';
import { TextChild } from '../../../types';

const CurrentPage = ({ children }: TextChild) => (
	<Center
		h={8}
		px={2}
		fontWeight='500'
		fontSize='.9rem'
		userSelect='none'>
		{children}
	</Center>
);

export default CurrentPage;
