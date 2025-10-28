import { FC, ReactNode } from 'react';
import { Dialog } from '@chakra-ui/react';

type AlertContentProps = {
	children: ReactNode;
	[key: string]: any;
};

const AlertContent: FC<AlertContentProps> = ({ children, ...props }) => {
	return (
		<Dialog.Content
			boxShadow='lg'
			borderRadius='xl'
			bg='menu.light'
			_dark={{
				bg: 'menu.dark',
			}}
			{...props}>
			{children}
		</Dialog.Content>
	);
};

export default AlertContent;
