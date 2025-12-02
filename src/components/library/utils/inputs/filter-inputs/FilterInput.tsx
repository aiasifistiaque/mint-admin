import { Input, InputProps } from '@chakra-ui/react';
import { FC } from 'react';

type FilterInputProps = InputProps & {
	date?: boolean;
};

const FilterInput: FC<FilterInputProps> = ({ date, ...props }) => {
	const style = {
		size: { base: '42px', md: 'xs' },
		borderRadius: '4px',
		h: { base: '42px', md: '28px' },
		borderColor: 'gray.200',
		px: 2,
		fontSize: '14px',
		color: 'text.light',
		_dark: {
			borderColor: 'selectBorder.dark',
			color: 'text.dark',
		},
		...(date && { w: '100px' }),
	};

	if (date)
		return (
			<Input
				css={style}
				type='date'
				{...props}
			/>
		);
	return (
		<Input
			css={style}
			{...props}
		/>
	);
};

export default FilterInput;
