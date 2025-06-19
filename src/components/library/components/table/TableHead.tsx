import { FC, ReactNode } from 'react';
import { Thead, FlexProps } from '@chakra-ui/react';

type TableHeadProps = FlexProps & {
	children: ReactNode;
	onClick?: () => void;
	type?: string;
};

export const TableHead: FC<TableHeadProps> = ({ children, onClick, ...props }) => {
	return <Thead {...props}>{children}</Thead>;
};

export default TableHead;
