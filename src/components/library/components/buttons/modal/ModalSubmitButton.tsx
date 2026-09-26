import { FC, ReactNode } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { radius } from '../../../config';

type ModalSubmitButtonProps = ButtonProps & {
	isLoading: boolean;
	children?: ReactNode;
};

/** The drawer's one primary action. Matches DiscardButton's metrics exactly. */
const ModalSubmitButton: FC<ModalSubmitButtonProps> = ({ children, isLoading, loading, ...props }) => {
	return (
		<Button
			// `isLoading` is the v2 name callers still pass; Chakra v3 only knows `loading`.
			loading={isLoading || loading}
			loadingText='Processing'
			spinnerPlacement='start'
			size='sm'
			minW='84px'
			px={4}
			h={CONTROL_H}
			borderRadius={radius.BUTTON}
			fontSize='13px'
			fontWeight='500'
			type='submit'
			{...props}>
			{children || 'Confirm'}
		</Button>
	);
};

const CONTROL_H = '36px';

export default ModalSubmitButton;
