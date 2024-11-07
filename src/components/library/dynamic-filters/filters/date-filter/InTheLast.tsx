import React, { useState, ChangeEvent, useEffect } from 'react';
import { Grid } from '@chakra-ui/react';

import { Icon, FilterSelect, FilterInput } from '../../../';

const InTheLast = ({ setVal }: { setVal: (val: string) => void }) => {
	const [value, setValue] = useState<number>(1);
	const [condition, setCondition] = useState<string>('days');

	const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = parseInt(e.target.value);
		setValue(newValue);
	};

	const handleCondition = (e: ChangeEvent<HTMLSelectElement>) => {
		const newCondition = e.target.value;
		setCondition(newCondition);
	};

	useEffect(() => {
		setVal(`${condition}_${value}`);
	}, [value, condition]);

	return (
		<Grid
			gap={2}
			px={1}
			gridTemplateColumns='.6fr 2fr 4fr 2fr'>
			<Icon name='arrow' />
			<FilterInput
				type='number'
				value={value}
				onChange={handleValue}
			/>
			<FilterSelect
				value={condition}
				onChange={handleCondition}>
				<option value='days'>days</option>
				<option value='months'>months</option>
			</FilterSelect>
		</Grid>
	);
};

export default InTheLast;
