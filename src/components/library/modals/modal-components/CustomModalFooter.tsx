import { FC, ReactNode } from 'react';
import { Dialog } from '@chakra-ui/react';

type CustomModalFooterProps = {
	children?: ReactNode;
	[key: string]: any;
};

const CustomModalFooter: FC<CustomModalFooterProps> = ({ children, ...props }) => {
	return (
		<Dialog.Footer
			px={{ base: 4, md: 6 }}
			py={3}
			gap={2}
			borderTopWidth={1}
			borderColor='border.muted'
			bg='bg.subtle'
			justifyContent='flex-end'
			alignItems='center'
			{...props}>
			{children}
		</Dialog.Footer>
	);
};

export default CustomModalFooter;
