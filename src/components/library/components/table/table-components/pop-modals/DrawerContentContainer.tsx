import { FC, ReactNode } from 'react';
import { DrawerContent, DrawerContentProps } from '@chakra-ui/react';

type DrawerContentType = DrawerContentProps & {
	children: ReactNode;
};

const DrawerContentContainer: FC<DrawerContentType> = ({ children, ...props }) => {
	return (
		<DrawerContent
			bg='menu.light'
			_dark={{
				bg: 'menu.dark',
			}}
			w='100%'
			maxH='85vh'
			minH='20vh'
			userSelect='none'
			borderTopRadius='20px'
			{...props}>
			{children}
		</DrawerContent>
	);
};

export default DrawerContentContainer;
