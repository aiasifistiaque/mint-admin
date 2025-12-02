import { ReactNode } from 'react';
import { Flex, Text, FlexProps } from '@chakra-ui/react';

const TableErrorMessage = ({
	title,
	children,
	...props
}: FlexProps & { title: string; children: ReactNode }) => {
	return (
		<Flex
			align='center'
			justify='center'
			flexDir='column'
			textAlign='center'
			h={{
				base: '300px',
				md: '200px',
			}}
			{...props}>
			<Text>{title}</Text>
			<Text>{children}</Text>
		</Flex>
	);
};

export default TableErrorMessage;
