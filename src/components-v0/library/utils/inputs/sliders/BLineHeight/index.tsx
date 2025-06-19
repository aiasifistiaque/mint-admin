'use client';

import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark } from '@chakra-ui/react';
import React from 'react';
import { FormControl } from '../../../..';
import { labelStyle, variables, SliderProps, toolTipStyle } from '../styles';

const BLineHeight: React.FC<SliderProps> = ({
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
				value: val / 100,
			},
		});
	};

	const values = [100, 115, 150, 170, 200, 220];

	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}
			h={variables?.height}>
			<Slider
				min={80}
				max={250}
				value={value ? value * 100 : 100}
				step={5}
				mb={2}
				onChange={handleChange}>
				{values.map(val => (
					<SliderMark
						key={value}
						value={val}
						{...labelStyle}>
						{val / 100}
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
