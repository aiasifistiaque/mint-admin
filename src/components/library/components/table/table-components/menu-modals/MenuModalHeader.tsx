import { FC, ReactNode } from 'react';
import { useIsMobile, ModalHeader } from '../../../..';
import { Drawer, Dialog } from '@chakra-ui/react';

type MenuModalHeaderProps = {
	children: ReactNode;
	[key: string]: any;
};

const MenuModalHeader: FC<MenuModalHeaderProps> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return (
			<Drawer.Header
				p={{ base: 4, md: 6 }}
				color='text.light'
				fontWeight='semibold'
				fontSize='lg'
				_dark={{ color: 'text.dark' }}
				h='52px'>
				<Drawer.Title>{children}</Drawer.Title>
			</Drawer.Header>
		);
	}

	return (
		<Dialog.Header
			p={{ base: 4, md: 6 }}
			color='text.light'
			fontWeight='semibold'
			fontSize='lg'
			_dark={{ color: 'text.dark' }}
			h='52px'
			{...props}>
			{children}
		</Dialog.Header>
	);
};

export default MenuModalHeader;
