import { FC, ReactNode } from 'react';
import { useIsMobile } from '../../../..';
import { DrawerBody, DrawerContentProps, ModalBody, ModalBodyProps } from '@chakra-ui/react';

type MenuModalBodyProps = ModalBodyProps &
	DrawerContentProps & {
		children: ReactNode;
	};

const MenuModalBody: FC<MenuModalBodyProps> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return (
			<DrawerBody
				px={{ base: 4, md: 6 }}
				overflowY='scroll'
				{...props}>
				{children}
			</DrawerBody>
		);
	}

	return (
		<ModalBody
			px={{ base: 4, md: 6 }}
			{...props}>
			{children}
		</ModalBody>
	);
};

export default MenuModalBody;
