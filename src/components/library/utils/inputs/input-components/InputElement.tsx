import { Input, InputProps } from '@chakra-ui/react';

const InputElement = ({ ...props }: InputProps) => {
	// const borderColor = useColorModeValue('brand.500', 'brand.200');

	return (
		<Input
			size='sm'
			px={3}
			borderRadius='md'
			fontSize='14px'
			color='text.500'
			_dark={{
				color: 'white',
				borderColor: 'selectBorder.dark',
				_placeholder: { color: 'text.inputPlaceholder.dark' },
			}}
			_placeholder={{ fontSize: 14, fontWeight: '500', color: 'gray.200' }}
			{...props}
		/>
	);
};

export default InputElement;
