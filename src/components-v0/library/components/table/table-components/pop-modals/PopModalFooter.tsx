import React, { FC } from 'react';
import { DrawerFooter } from '@chakra-ui/react';

type MenuModalBodyProps = {
	children: React.ReactNode;
	isMobile: boolean;
};

const PopModalFooter: FC<MenuModalBodyProps> = ({ children, isMobile }) => {
	if (isMobile) {
		return (
			<DrawerFooter
				mx={0}
				px={4}>
				{children}
			</DrawerFooter>
		);
	}

	return <>{children}</>;
};

export default PopModalFooter;
