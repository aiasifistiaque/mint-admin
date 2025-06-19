import { FC, ReactNode } from 'react';
import { AlertDialogContent } from '@chakra-ui/react';

type AlertContentProps = {
	children: ReactNode;
};

const AlertContent: FC<AlertContentProps> = ({ children }) => {
	return (
		<AlertDialogContent
			boxShadow='lg'
			borderRadius='xl'
			bg='menu.light'
			_dark={{
				bg: 'menu.dark',
			}}>
			{children}
		</AlertDialogContent>
	);
};

export default AlertContent;
