import { FormLabelProps, FormLabel } from '@chakra-ui/react';
import React, { FC } from 'react';

const FONT_SIZE = '.85rem';
const FONT_WEIGHT = '600';
const M = 0;

type LabelProps = FormLabelProps & {
	children: any;
};

const Label: FC<LabelProps> = ({ children, ...props }) => {
	return (
		<FormLabel
			userSelect='none'
			m={M}
			fontSize={FONT_SIZE}
			fontWeight={FONT_WEIGHT}
			{...props}>
			{children}
		</FormLabel>
	);
};

export default Label;
