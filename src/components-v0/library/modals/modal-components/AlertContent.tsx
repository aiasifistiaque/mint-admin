import React, { FC } from 'react';
import { AlertDialogContent } from '@chakra-ui/react';

type AlertContentProps = {
	children: React.ReactNode;
};

const AlertContent: FC<AlertContentProps> = ({ children }) => {
	return (
		<AlertDialogContent
			boxShadow='lg'
			borderRadius='xl'
			bg='menu.light'
			zIndex={100000}
			_dark={{
				bg: 'menu.dark',
			}}>
			{children}
		</AlertDialogContent>
	);
};

export default AlertContent;
