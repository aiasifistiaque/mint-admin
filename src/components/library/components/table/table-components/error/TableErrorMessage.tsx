import { ReactNode } from 'react';
import { Center, Text, FlexProps } from '@chakra-ui/react';

const TableErrorMessage = ({
	title,
	children,
	...props
}: FlexProps & { title: string; children: ReactNode }) => {
	return (
		<Center
			flexDir='column'
			textAlign='center'
			h={{
				base: '300px',
				md: '200px',
			}}
			{...props}>
			<Text>{title}</Text>
			<Text>{children}</Text>
		</Center>
	);
};

export default TableErrorMessage;
