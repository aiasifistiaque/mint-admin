import { FC, ReactNode } from 'react';
import { useIsMobile, ModalFooter } from '../../../..';
import { DrawerFooter } from '@chakra-ui/react';

type MenuModalBodyProps = {
	children: ReactNode;
};

const MenuModalFooter: FC<MenuModalBodyProps> = ({ children }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return (
			<DrawerFooter
				_light={{ bg: 'background.light' }}
				gap={2}>
				{children}
			</DrawerFooter>
		);
	}

	return (
		<ModalFooter
			w='full'
			gap={2}
			py={2}
			_light={{ bg: 'background.light' }}
			justifyContent='flex-end'
			alignItems='center'>
			{children}
		</ModalFooter>
	);
};

export default MenuModalFooter;
