import { FC, ReactNode } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

type ModalSubmitButtonProps = ButtonProps & {
	isLoading?: boolean;
	children?: ReactNode;
};

const AlertSubmitButton: FC<ModalSubmitButtonProps> = ({ children, ...props }) => {
	return (
		<Button
			type='submit'
			size='sm'
			minW='84px'
			px={4}
			{...props}>
			{children || 'Confirm'}
		</Button>
	);
};

export default AlertSubmitButton;
