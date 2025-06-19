'use client';

import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark } from '@chakra-ui/react';
import { FC } from 'react';
import { FormControl } from '../../../..';
import { labelStyle, variables, SliderProps, toolTipStyle } from '../styles';

const BLineHeight: FC<SliderProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	hideNew = false,
	type = 'value',
	unselect = true,
	...props
}) => {
	const handleChange = (val: any) => {
		props?.onChange({
			target: {
				name: props.name,
				value: val / 1000,
			},
		});
	};

	const values = [0, 250, 500, 750, 1000];

	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}
			h={variables?.height}>
			<Slider
				min={0}
				max={1000}
				value={value ? value * 1000 : 1000}
				step={10}
				onChange={handleChange}>
				{values.map(value => (
					<SliderMark
						key={value}
						value={value * 1000}
						{...labelStyle}>
						{value / 1000}
					</SliderMark>
				))}

				<SliderMark
					value={value * 100}
					{...toolTipStyle}>
					{value}
				</SliderMark>

				<SliderTrack bg={variables?.track}>
					<SliderFilledTrack bg={variables?.filledTrack} />
				</SliderTrack>
				<SliderThumb boxSize={variables?.boxSize} />
			</Slider>
		</FormControl>
	);
};

export default BLineHeight;
