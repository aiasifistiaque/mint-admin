import { FC, ReactNode } from 'react';
import { Accordion, Box, FlexProps, Grid, GridItem, GridProps } from '@chakra-ui/react';
import { radius } from '../../config';
import { useColorMode } from '@/components/ui/color-mode';

type FormDivisionProps = FlexProps & {
	children: ReactNode;
	isModal?: boolean;
	title?: string;
	value?: string;
};

const FormDivisionAccordion: FC<FormDivisionProps> = ({
	children,
	isModal = false,
	title,
	value,
	...props
}) => {
	const { colorMode } = useColorMode();

	return (
		<Accordion.Item
			value={value || title || 'section'}
			{...accordionCss(isModal, colorMode)}
			{...props}>
			<Accordion.ItemTrigger p={4}>
				<Box {...modalTitleCss(colorMode)}>{title}</Box>
				<Accordion.ItemIndicator />
			</Accordion.ItemTrigger>
			<Accordion.ItemContent>
				<Grid {...childrenGridCss}>{children}</Grid>
			</Accordion.ItemContent>
		</Accordion.Item>
	);
};

const accordionCss = (isModal: boolean, colorMode: string): any => {
	return {
		borderWidth: 1,
		boxShadow: isModal ? 'none' : 'md',
		bg: isModal
			? colorMode === 'dark'
				? 'menu.dark'
				: 'menu.light'
			: colorMode === 'dark'
			? 'background.dark'
			: 'white',
		borderColor: colorMode === 'dark' ? 'border.dark' : 'border.light',
		mb: 4,
		borderRadius: radius.MODAL,
	};
};

const modalTitleCss = (colorMode: string): any => {
	return {
		py: 2,
		fontSize: '18px',
		fontWeight: '700',
		as: 'span',
		flex: '1',
		color: colorMode === 'dark' ? 'text.heading.dark' : 'text.heading.light',
		textAlign: 'left',
	};
};

const childrenGridCss: GridProps = {
	gridTemplateColumns: 'repeat(2, 1fr)',
	gap: 8,
	w: 'full',
	columnGap: 4,
	p: 4,
};

export default FormDivisionAccordion;
