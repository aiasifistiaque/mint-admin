import { FC, ReactNode } from 'react';
import { NativeSelectFieldProps, NativeSelect } from '@chakra-ui/react';
import { Icon } from '../../..';

type FilterSelectProps = NativeSelectFieldProps & {
	children: ReactNode;
};

const FilterSelect: FC<FilterSelectProps> = ({ children, ...props }) => {
	return (
		<NativeSelect.Root size='xs'>
			<NativeSelect.Field
				color='text.light'
				borderRadius='md'
				fontSize='14px'
				h={{ base: '42px', md: '28px' }}
				boxShadow='md'
				px={2}
				borderColor='selectBorder.light'
				_dark={{
					color: 'text.dark',
					borderColor: 'selectBorder.dark',
				}}
				{...props}>
				{children}
			</NativeSelect.Field>
			<NativeSelect.Indicator>
				<Icon name='select' />
			</NativeSelect.Indicator>
		</NativeSelect.Root>
	);
};

export default FilterSelect;
