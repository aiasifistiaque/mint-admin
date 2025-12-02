import { Text, TextProps } from '@chakra-ui/react';
import { FC } from 'react';

const FONT_SIZE = '.85rem';
const FONT_WEIGHT = '600';
const M = 0;

type LabelProps = TextProps & {
	children: any;
};

const Label: FC<LabelProps> = ({ children, ...props }) => {
	return (
		<Text
			color='text.formLabel.light'
			_dark={{ color: 'text.formLabel.dark' }}
			userSelect='none'
			m={M}
			fontSize={FONT_SIZE}
			fontWeight={FONT_WEIGHT}
			{...props}>
			{children}
		</Text>
	);
};

export default Label;
