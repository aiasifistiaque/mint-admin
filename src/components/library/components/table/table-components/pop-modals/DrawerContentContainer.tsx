import { FC, ReactNode } from 'react';
import { Drawer, DrawerContentProps, Box } from '@chakra-ui/react';
import { styles } from '../../../..';

type DrawerContentType = DrawerContentProps & {
	children: ReactNode;
};

/** Matches the sheet used by the sort and column-picker drawers. */
const DrawerContentContainer: FC<DrawerContentType> = ({ children, ...props }) => {
	return (
		<Drawer.Content
			bg='menu.light'
			_dark={{ bg: 'menu.dark' }}
			boxShadow={styles.DRAWER.boxShadow}
			w='100%'
			maxH='90vh'
			minH='20vh'
			userSelect='none'
			overflow='hidden'
			borderTopRadius='20px'
			{...props}>
			<Box
				mx='auto'
				mt={3}
				mb={1}
				w='36px'
				h='4px'
				flexShrink={0}
				borderRadius='full'
				bg='border.emphasized'
			/>
			{children}
		</Drawer.Content>
	);
};

export default DrawerContentContainer;
