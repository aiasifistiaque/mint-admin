import { FC, ReactNode } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

type ConfirmButtonProps = ButtonProps & {
	children?: ReactNode;
	icon?: ReactNode;
};

const ConfirmButton: FC<ConfirmButtonProps> = ({ children, icon, ...props }) => {
	return (
		<Button
			px={3}
			size='sm'
			{...props}>
			{children || 'Confirm'}
		</Button>
	);
};

export default ConfirmButton;
