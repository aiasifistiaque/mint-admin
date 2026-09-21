import { FC, ReactNode } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { radius } from '../../../config';

type DiscardButtonProps = ButtonProps & {
	children?: ReactNode;
};

/**
 * The secondary action in a drawer footer. Outlined rather than filled, so the
 * one filled button beside it is unambiguously the thing you came to do —
 * two solid buttons of equal weight make you stop and read both.
 */
const DiscardButton: FC<DiscardButtonProps> = ({ children, ...props }) => {
	return (
		<Button
			variant='outline'
			size='sm'
			minW='84px'
			px={4}
			h={CONTROL_H}
			borderRadius={radius.BUTTON}
			fontSize='13px'
			fontWeight='500'
			{...props}>
			{children || 'Discard'}
		</Button>
	);
};

// Same height as the toolbar controls and the fields above it, so a footer
// button lines up with everything else in the drawer.
const CONTROL_H = '36px';

export default DiscardButton;
