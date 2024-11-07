import React from 'react';

import { PopoverContent, PopoverContentProps } from '@chakra-ui/react';

import { shadow, sizes } from '../../../';

type PopoverBodyProps = PopoverContentProps & {
	children: React.ReactNode;
};

const PopoverContainer: React.FC<PopoverBodyProps> = ({ children, ...props }) => {
	return (
		<PopoverContent
			boxShadow={shadow.MENU}
			borderRadius={sizes.RADIUS_MENU}
			bg='menu.light'
			_focusVisible={{
				outline: 'none',
			}}
			_dark={{
				bg: 'menu.dark',
			}}
			maxW={sizes.POPOVER_WIDTH}
			{...props}>
			{children}
		</PopoverContent>
	);
};

export default PopoverContainer;
