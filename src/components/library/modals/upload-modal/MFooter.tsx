import { ReactNode } from 'react';
import { Dialog } from '@chakra-ui/react';
import { styles } from '../../config';

const MFooter = ({ children, ...props }: { children: ReactNode; [key: string]: any }) => {
	return (
		<Dialog.Footer
			borderTopWidth={1}
			borderTopColor='border.light'
			borderBottomRadius={styles.MODAL.borderRadius}
			w='full'
			gap={2}
			py={2}
			_light={{ bg: 'background.light' }}
			_dark={{ bg: 'background.dark', borderTopColor: 'border.dark' }}
			justifyContent='flex-end'
			alignItems='center'
			{...props}>
			{children}
		</Dialog.Footer>
	);
};

export default MFooter;
