import { FC, ReactNode } from 'react';
import { Dialog } from '@chakra-ui/react';

type CustomModalFooterProps = {
	children?: ReactNode;
	[key: string]: any;
};

const CustomModalFooter: FC<CustomModalFooterProps> = ({ children, ...props }) => {
	return (
		<Dialog.Footer
			borderTopWidth={1}
			borderColor='container.borderLight'
			_dark={{ borderColor: 'border.dark' }}
			borderBottomRadius='2xl'
			py={3}
			{...props}>
			{children}
		</Dialog.Footer>
	);
};

export default CustomModalFooter;
