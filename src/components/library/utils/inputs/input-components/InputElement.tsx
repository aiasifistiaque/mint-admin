import { Input, InputProps, useColorModeValue } from '@chakra-ui/react';

const InputElement = ({ ...props }: InputProps) => {
	const borderColor = useColorModeValue('brand.500', 'brand.200');

	return (
		<Input
			size='sm'
			px={3}
			borderRadius='lg'
			focusBorderColor={borderColor}
			color='text.500'
			_dark={{
				color: 'gray.300',
			}}
			_placeholder={{ fontSize: 14, fontWeight: '500' }}
			{...props}
		/>
	);
};

export default InputElement;
