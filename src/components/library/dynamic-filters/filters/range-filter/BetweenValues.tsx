import { ChangeEvent, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import FilterInput from '../../../utils/inputs/filter-inputs/FilterInput';

const BetweenValues = ({ setVal }: { setVal: (val: string) => void }) => {
	const [start, setStart] = useState<any>();
	const [end, setEnd] = useState<any>();

	const handleStart = (e: ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value;
		setStart(newDate);
		setVal(`${newDate}_${end}`);
	};

	const handleEnd = (e: ChangeEvent<HTMLInputElement>) => {
		const newDate = e.target.value;
		setEnd(newDate);
		setVal(`${start}_${newDate}`);
	};

	return (
		<Flex
			alignItems='center'
			gap={2}
			w='full'>
			{/* Both boxes flex equally; the first used to be w='100%' and the
			    second auto, so the pair never lined up. */}
			<FilterInput
				type='number'
				value={start}
				onChange={handleStart}
				placeholder='Min'
				flex='1'
			/>
			<Text
				fontSize='13px'
				color='fg.muted'
				flexShrink={0}>
				&amp;
			</Text>
			<FilterInput
				type='number'
				value={end}
				onChange={handleEnd}
				placeholder='Max'
				flex='1'
			/>
		</Flex>
	);
};

export default BetweenValues;
