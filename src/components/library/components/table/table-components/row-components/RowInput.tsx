import { FC } from 'react';
import { Input, InputProps } from '@chakra-ui/react';

const RowInput: FC<InputProps> = ({ ...props }) => {
	return (
		<Input
			size={{ base: 'sm', md: 'xs' }}
			borderRadius='lg'
			color='text.500'
			fontWeight='600'
			borderColor='selectBorder.light'
			_dark={{
				color: 'gray.300',
				borderColor: 'selectBorder.dark',
			}}
			boxShadow='sm'
			w='100px'
			{...props}
		/>
	);
};

export default RowInput;
