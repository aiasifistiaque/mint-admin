import { FormHelperText, FormHelperTextProps } from '@chakra-ui/react';
import { FC } from 'react';

const FONT_SIZE = '.8rem';
const PX = 1;
const COLOR = '#444';
const COLOR_DARK = '#f5f5f5';

type HelperTextProps = FormHelperTextProps & {
	children: string;
};

const HelperText: FC<HelperTextProps> = ({ children, ...props }) => {
	return (
		<FormHelperText
			color={COLOR}
			px={PX}
			fontStyle='italic'
			fontSize={FONT_SIZE}
			_dark={{ color: COLOR_DARK }}
			{...props}>
			{children}
		</FormHelperText>
	);
};

export default HelperText;
