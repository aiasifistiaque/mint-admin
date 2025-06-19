import { FC, ReactNode } from 'react';
import {
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionItemProps,
	AccordionPanel,
	Box,
	FlexProps,
	Grid,
	GridItem,
	GridProps,
} from '@chakra-ui/react';
import { radius } from '../../config';

type FormDivisionProps = FlexProps & {
	children: ReactNode;
	isModal?: boolean;
	title?: string;
};

const FormDivisionAccordion: FC<FormDivisionProps> = ({
	children,
	isModal = false,
	title,
	...props
}) => {
	return (
		<AccordionItem
			{...accordionCss(isModal)}
			{...props}>
			<AccordionButton
				as={GridItem}
				colSpan={2}>
				<Box {...modalTitleCss}>{title}</Box>
				<AccordionIcon />
			</AccordionButton>
			<AccordionPanel>
				<Grid {...childrenGridCss}>{children}</Grid>
			</AccordionPanel>
		</AccordionItem>
	);
};

const accordionCss = (isModal: boolean): AccordionItemProps => {
	return {
		borderWidth: 1,
		boxShadow: isModal ? 'none' : 'md',
		bg: isModal ? 'menu.light' : 'white',
		borderColor: 'border.light',
		mb: 4,
		_dark: { bg: isModal ? 'menu.dark' : 'background.dark', borderColor: 'border.dark' },
		borderRadius: radius.MODAL,
	};
};

const modalTitleCss: any = {
	py: 2,
	fontSize: '18px',
	fontWeight: '700',
	as: 'span',
	flex: '1',
	color: 'text.heading.light',
	_dark: { color: 'text.heading.dark' },
	textAlign: 'left',
};

const childrenGridCss: GridProps = {
	templateColumns: 'repeat(2, 1fr)',
	gap: 8,
	w: 'full',
	columnGap: 4,
};

export default FormDivisionAccordion;
