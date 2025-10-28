import { Text, TextProps } from '@chakra-ui/react';
import { FC } from 'react';
import { useColorMode } from '@/components/ui/color-mode';

const FONT_SIZE = '.8rem';
const PX = 1;
const COLOR = '#444';
const COLOR_DARK = '#f5f5f5';

type HelperTextProps = TextProps & {
	children: string;
};

const HelperText: FC<HelperTextProps> = ({ children, ...props }) => {
	const { colorMode } = useColorMode();

	return (
		<Text
			color={colorMode === 'dark' ? COLOR_DARK : COLOR}
			px={PX}
			fontStyle='italic'
			fontSize={FONT_SIZE}
			{...props}>
			{children}
		</Text>
	);
};

export default HelperText;
