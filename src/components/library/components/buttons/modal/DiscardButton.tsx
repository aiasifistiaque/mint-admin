import { FC, ReactNode } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

type DiscardButtonProps = ButtonProps & {
	children?: ReactNode;
};

const DiscardButton: FC<DiscardButtonProps> = ({ children, ...props }) => {
	return (
		<Button
			variant='outline'
			size='sm'
			minW='84px'
			px={4}
			{...props}>
			{children || 'Discard'}
		</Button>
	);
};

export default DiscardButton;
