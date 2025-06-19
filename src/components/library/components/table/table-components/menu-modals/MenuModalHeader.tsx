import { FC, ReactNode } from 'react';
import { useIsMobile, ModalHeader } from '../../../..';
import { DrawerHeader, Flex, ModalHeaderProps } from '@chakra-ui/react';

type MenuModalBodyProps = ModalHeaderProps & {
	children: ReactNode;
};

const MenuModalHeader: FC<MenuModalBodyProps> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return <DrawerHeader>{children}</DrawerHeader>;
	}

	return (
		<ModalHeader
			h='52px'
			{...props}>
			{children}
		</ModalHeader>
	);
};

export default MenuModalHeader;
