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
				// icon={<Icon name='select' />}

				borderRadius='md'
				h={{ base: '42px', md: '28px' }}
				boxShadow='md'
				borderColor='selectBorder.light'
				_dark={{
					borderColor: 'selectBorder.dark',
				}}
				{...props}>
				{children}
			</NativeSelect.Field>
		</NativeSelect.Root>
	);
};

export default FilterSelect;
