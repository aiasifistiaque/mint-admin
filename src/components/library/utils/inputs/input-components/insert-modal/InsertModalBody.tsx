import { FC, ReactNode } from 'react';
import { Dialog } from '@chakra-ui/react';

type InsertModalBodyProps = {
	children: ReactNode;
	[key: string]: any;
};

const InsertModalBody: FC<InsertModalBodyProps> = ({ children, ...props }) => {
	return (
		<Dialog.Body
			minH='70vh'
			{...props}>
			{children}
		</Dialog.Body>
	);
};

export default InsertModalBody;
