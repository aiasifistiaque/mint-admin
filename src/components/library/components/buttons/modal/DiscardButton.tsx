import { FC, ReactNode } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

type DiscardButtonProps = ButtonProps & {
	children?: ReactNode;
};

const DiscardButton: FC<DiscardButtonProps> = ({ children, ...props }) => {
	return (
		<Button
			variant='white'
			size='sm'
			{...props}>
			{children || 'Discard'}
		</Button>
	);
};

export default DiscardButton;
