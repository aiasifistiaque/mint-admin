import { Center, FlexProps, Text, Tooltip, Flex } from '@chakra-ui/react';
import { ReactNode, FC } from 'react';

type SquareButtonProps = FlexProps & {
	label: string;
	children: ReactNode;
};

const SquareButton: FC<SquareButtonProps> = ({ children, label, ...props }) => {
	return (
		<Flex
			// whileTap={{ scale: 0.8 }}
			onClick={props.onClick}>
			<Tooltip label={label}>
				<Center
					userSelect='none'
					boxSize={8}
					cursor='pointer'
					borderRadius={1}
					_hover={{
						boxShadow: 'md',
					}}
					{...props}>
					<Text>{children}</Text>
				</Center>
			</Tooltip>
		</Flex>
	);
};

export default SquareButton;
