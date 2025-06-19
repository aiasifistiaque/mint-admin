'use client';

import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark } from '@chakra-ui/react';
import { FC } from 'react';
import { FormControl } from '../../../..';
import { labelStyle, variables, SliderProps, toolTipStyle } from '../styles';

const BSlider: FC<
	SliderProps & { values: number[]; threshold: number; min?: number; max?: number; step?: number }
> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	hideNew = false,
	type = 'value',
	unselect = true,
	values,
	threshold,
	min,
	max,
	step,
	...props
}) => {
	const handleChange = (val: any) => {
		props?.onChange({
			target: {
				name: props.name,
				value: val / threshold,
			},
		});
	};

	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}
			h={variables?.height}>
			<Slider
				min={min || 0}
				max={max || threshold}
				value={value ? value * threshold : threshold}
				step={step || 10}
				mb={3}
				onChange={handleChange}>
				{values?.map((value: number) => (
					<SliderMark
						key={value}
						value={value * threshold}
						{...labelStyle}>
						{value}
					</SliderMark>
				))}

				<SliderMark
					value={value * threshold}
					{...toolTipStyle}>
					{value} px
				</SliderMark>

				<SliderTrack bg={variables?.track}>
					<SliderFilledTrack bg={variables?.filledTrack} />
				</SliderTrack>
				<SliderThumb boxSize={variables?.boxSize} />
			</Slider>
		</FormControl>
	);
};

export default BSlider;
