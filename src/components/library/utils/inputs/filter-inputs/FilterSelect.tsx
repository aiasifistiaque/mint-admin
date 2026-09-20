import { FC, ReactNode } from 'react';
import { NativeSelectFieldProps, NativeSelect } from '@chakra-ui/react';
import { Icon } from '../../..';
import { styles, radius } from '../../../config';
import { FILTER_CONTROL_HEIGHT } from './FilterInput';

type FilterSelectProps = NativeSelectFieldProps & {
	children: ReactNode;
};

const FilterSelect: FC<FilterSelectProps> = ({ children, ...props }) => {
	return (
		<NativeSelect.Root
			size='sm'
			w='full'>
			<NativeSelect.Field
				{...(styles.FIELD as any)}
				// The old `boxShadow='md'` put a drop shadow on a 28px control
				// sitting inside an already-elevated popover.
				boxShadow='none'
				h={FILTER_CONTROL_HEIGHT}
				px={2.5}
				borderRadius={radius.INPUT}
				cursor='pointer'
				{...props}>
				{children}
			</NativeSelect.Field>
			<NativeSelect.Indicator color='fg.muted'>
				<Icon name='select' />
			</NativeSelect.Indicator>
		</NativeSelect.Root>
	);
};

export default FilterSelect;
