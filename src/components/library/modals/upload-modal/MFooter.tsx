import { ReactNode } from 'react';
import { ModalFooter, ModalFooterProps } from '@chakra-ui/react';

const MFooter = ({ children, ...props }: ModalFooterProps & { children: ReactNode }) => {
	return (
		<ModalFooter
			borderTopWidth={1}
			borderTopColor='border.light'
			borderBottomRadius='20px'
			w='full'
			gap={2}
			py={2}
			_light={{ bg: 'background.light' }}
			_dark={{ bg: 'background.dark', borderTopColor: 'border.dark' }}
			justifyContent='flex-end'
			alignItems='center'>
			{children}
		</ModalFooter>
	);
};

export default MFooter;
