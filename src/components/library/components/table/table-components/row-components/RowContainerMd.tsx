import { FC, ReactNode } from 'react';
import { Tr, TextProps } from '@chakra-ui/react';

type RowContainerMdProps = TextProps & {
	children: ReactNode;
};

const RowContainerMd: FC<RowContainerMdProps> = ({ children, ...props }) => {
	return (
		<Tr
			h='60px'
			bg='table.row.light'
			_dark={{
				bg: 'table.row.dark',
				borderBottomColor: 'table.innerBorder.dark',
			}}
			_notLast={{
				borderBottom: '1px solid',
				borderBottomColor: 'table.innerBorder.light',
			}}
			{...props}>
			{children}
		</Tr>
	);
};

export default RowContainerMd;
