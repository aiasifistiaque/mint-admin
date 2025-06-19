'use client';

import React, { FC } from 'react';
import { Flex, InputProps, Tooltip } from '@chakra-ui/react';
import { FormControl, Icon } from '../../..';
import { AlignBox } from '../helper-components';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string | number | undefined;
	placeholder?: any;
	options?: { label: string; value: string; message?: string }[];
};

const alignments = [
	{ label: 'align-left', value: 'left' },
	{ label: 'align-center', value: 'center' },
	{ label: 'align-right', value: 'right' },
];

const VAlignment: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	options = alignments,
	...props
}) => {
	const onChange = (e: string) => {
		if (props.onChange) {
			const event = {
				target: {
					name: props.name,
					value: e,
				},
			} as any;
			props.onChange(event);
		}
	};
	const size = 20;
	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}>
			<Flex
				mt={0}
				align='center'
				gap={1}>
				{options.map((item: any, i: number) => (
					<AlignBox
						key={i}
						onClick={() => onChange(item.value)}
						isSelected={value === item.value}>
						<Tooltip label={item.value}>
							<span>
								<Icon
									name={item.label}
									size={size}
								/>
							</span>
						</Tooltip>
					</AlignBox>
				))}
			</Flex>
		</FormControl>
	);
};

export default VAlignment;
