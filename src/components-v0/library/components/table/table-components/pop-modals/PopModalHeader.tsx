import React, { FC } from 'react';
import { DrawerHeader, PopoverHeader } from '@chakra-ui/react';

type MenuModalBodyProps = {
	children: React.ReactNode;
	isMobile: boolean;
};

const PopModalHeader: FC<MenuModalBodyProps> = ({ children, isMobile }) => {
	if (isMobile) {
		return (
			<DrawerHeader
				px={4}
				color='header.500'
				_dark={{ color: 'header.200' }}
				fontSize='.875rem'
				fontWeight='700'
				border='none'>
				{children}
			</DrawerHeader>
		);
	}

	return (
		<PopoverHeader
			color='header.500'
			_dark={{ color: 'header.200' }}
			fontSize='.875rem'
			fontWeight='700'
			border='none'>
			{children}
		</PopoverHeader>
	);
};

export default PopModalHeader;
