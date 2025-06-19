import { FC, ReactNode } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

type ModalSubmitButtonProps = ButtonProps & {
	isLoading: boolean;
	children?: ReactNode;
};

const AlertSubmitButton: FC<ModalSubmitButtonProps> = ({ children, ...props }) => {
	return (
		<Button
			type='submit'
			colorScheme='brand'
			ml={2}
			size='sm'
			{...props}>
			{children || 'Confirm'}
		</Button>
	);
};

export default AlertSubmitButton;
