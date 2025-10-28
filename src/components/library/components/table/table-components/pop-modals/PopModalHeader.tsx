import { FC, ReactNode } from 'react';
import { Drawer, Popover } from '@chakra-ui/react';

type PopModalHeaderProps = {
	children: ReactNode;
	isMobile: boolean;
};

const PopModalHeader: FC<PopModalHeaderProps> = ({ children, isMobile }) => {
	if (isMobile) {
		return (
			<Drawer.Header
				px={4}
				color='header.500'
				_dark={{ color: 'header.200' }}
				fontSize='.875rem'
				fontWeight='700'
				border='none'>
				{children}
			</Drawer.Header>
		);
	}

	return (
		<Popover.Header
			lineHeight={1.4}
			pb={1}
			color='header.500'
			_dark={{ color: 'header.200' }}
			fontSize='.9rem'
			fontWeight='700'
			border='none'>
			{children}
		</Popover.Header>
	);
};

export default PopModalHeader;
