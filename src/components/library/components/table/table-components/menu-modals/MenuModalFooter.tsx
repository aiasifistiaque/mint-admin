import { FC, ReactNode } from 'react';
import { styles, useIsMobile } from '../../../..';
import { Drawer, Dialog } from '@chakra-ui/react';

type MenuModalFooterProps = {
	children: ReactNode;
	[key: string]: any;
};

const MenuModalFooter: FC<MenuModalFooterProps> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return (
			<Drawer.Footer
				p={{ base: 4, md: 6 }}
				py={2}
				_light={{ bg: 'background.light' }}
				gap={2}
				{...props}>
				{children}
			</Drawer.Footer>
		);
	}

	return (
		<Dialog.Footer
			w='full'
			gap={2}
			px={{ base: 4, md: 6 }}
			borderTopWidth={1}
			borderColor='container.borderLight'
			_dark={{ borderColor: 'border.dark' }}
			py={2}
			borderBottomRadius={styles?.MODAL?.borderRadius || '8px'}
			_light={{ bg: 'background.light' }}
			justifyContent='flex-end'
			alignItems='center'
			{...props}>
			{children}
		</Dialog.Footer>
	);
};

export default MenuModalFooter;
