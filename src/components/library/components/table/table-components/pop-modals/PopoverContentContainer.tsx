import { sizes } from '../../../../';
import { PopoverContent, PopoverContentProps } from '@chakra-ui/react';
import React, { FC } from 'react';

type PopoverContentContainerProps = PopoverContentProps & {
	children: React.ReactNode;
};

const PopoverContentContainer: FC<PopoverContentContainerProps> = ({ children, ...props }) => {
	return (
		<PopoverContent
			boxShadow='lg'
			borderRadius='2xl'
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

export default PopoverContentContainer;
