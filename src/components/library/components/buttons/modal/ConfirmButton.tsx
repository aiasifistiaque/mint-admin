import { FC, ReactNode } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

type ConfirmButtonProps = ButtonProps & {
	children?: ReactNode;
	icon?: ReactNode;
};

const ConfirmButton: FC<ConfirmButtonProps> = ({ children, icon, ...props }) => {
	return (
		<Button
			size='sm'
			minW='84px'
			px={4}
			{...props}>
			{children || 'Confirm'}
		</Button>
	);
};

export default ConfirmButton;
