import { NativeSelect } from '@chakra-ui/react';
import { SelectChild } from '../../../types';

const SelectInput = ({ children, placeholder, ...props }: SelectChild) => (
	<NativeSelect.Root
		cursor='pointer'
		size='sm'
		_light={{
			bg: 'container.newLight',
		}}
		px={3}
		color='text.light'
		_dark={{
			color: 'text.dark',
		}}
		fontWeight='600'
		fontSize={12}
		borderRadius={4}
		{...props}>
		<NativeSelect.Field placeholder={placeholder || 'Select option'}>{children}</NativeSelect.Field>
		<NativeSelect.Indicator />
	</NativeSelect.Root>
);

export default SelectInput;
