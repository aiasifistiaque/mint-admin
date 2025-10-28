import { FC, ReactNode } from 'react';
import { useIsMobile } from '../../../..';
import { Drawer, Dialog } from '@chakra-ui/react';

type MenuModalBodyProps = {
	children: ReactNode;
	[key: string]: any;
};

const MenuModalBody: FC<MenuModalBodyProps> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	if (isMobile) {
		return (
			<Drawer.Body
				p={{ base: 4, md: 6 }}
				overflowY='scroll'
				{...props}>
				{children}
			</Drawer.Body>
		);
	}

	return (
		<Dialog.Body
			p={{ base: 4, md: 6 }}
			pt={{ base: 2, md: 2 }}
			{...props}>
			{children}
		</Dialog.Body>
	);
};

export default MenuModalBody;
