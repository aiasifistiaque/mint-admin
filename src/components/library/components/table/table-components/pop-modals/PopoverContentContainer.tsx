import { sizes, radius } from '../../../..';
import { PopoverContent, PopoverContentProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

type PopoverContentContainerProps = PopoverContentProps & {
	children: ReactNode;
};

const PopoverContentContainer: FC<PopoverContentContainerProps> = ({ children, ...props }) => {
	return (
		<PopoverContent
			boxShadow='lg'
			borderRadius={radius.MODAL}
			bg='menu.light'
			borderColor='container.borderLight'
			_focusVisible={{
				outline: 'none',
			}}
			_dark={{
				bg: 'menu.dark',
				borderColor: 'container.borderDark',
				borderWidth: 1,
			}}
			maxW={sizes.POPOVER_WIDTH}
			{...props}>
			{children}
		</PopoverContent>
	);
};

export default PopoverContentContainer;
