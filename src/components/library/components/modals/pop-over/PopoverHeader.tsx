import { ReactNode, FC } from 'react';
import { PopoverHeader as PHeader, PopoverHeaderProps } from '@chakra-ui/react';

type PopoverHeaderPropsType = PopoverHeaderProps & {
	children: ReactNode;
};

export const PopoverHeader: FC<PopoverHeaderPropsType> = ({ children, ...props }) => {
	return (
		<PHeader
			color='header.500'
			_dark={{ color: 'header.200' }}
			fontSize='.875rem'
			fontWeight='700'
			border='none'
			{...props}>
			{children}
		</PHeader>
	);
};

export default PopoverHeader;
