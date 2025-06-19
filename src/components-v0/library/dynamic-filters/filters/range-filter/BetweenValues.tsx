import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import FilterInput from '../../../utils/inputs/filter-inputs/FilterInput';

const BetweenValues = ({ setVal }: { setVal: (val: string) => void }) => {
	const [start, setStart] = React.useState<any>();
	const [end, setEnd] = React.useState<any>();

	const handleStart = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value;
		setStart(newDate);
		setVal(`${newDate}_${end}`);
	};

	const handleEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value;
		setEnd(newDate);
		setVal(`${start}_${newDate}`);
	};

	return (
		<Flex
			alignItems='center'
			gap={1}
			justifyContent='space-between'>
			<FilterInput
				type='number'
				value={start}
				onChange={handleStart}
				w='100%'
			/>
			<Text>{`&`}</Text>
			<FilterInput
				type='number'
				value={end}
				onChange={handleEnd}
			/>
		</Flex>
	);
};

export default BetweenValues;
