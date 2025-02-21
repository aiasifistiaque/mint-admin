import React, { FC } from 'react';
import {
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Flex,
	FlexProps,
	Grid,
	GridItem,
} from '@chakra-ui/react';

type FormDivisionProps = FlexProps & {
	children: React.ReactNode;
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
			bg={isModal ? 'menu.light' : 'white'}
			boxShadow={isModal ? 'none' : 'md'}
			borderWidth={1}
			mb={4}
			_dark={{ bg: isModal ? 'menu.dark' : 'background.dark' }}
			// p={4}
			borderRadius='12px'
			{...props}>
			<AccordionButton
				as={GridItem}
				colSpan={2}>
				<Box
					py={2}
					fontSize='18px'
					fontWeight='700'
					as='span'
					flex='1'
					textAlign='left'>
					{title}
				</Box>
				<AccordionIcon />
			</AccordionButton>
			<AccordionPanel>
				<Grid
					templateColumns='repeat(2, 1fr)'
					gap={8}
					w='full'
					columnGap={4}>
					{children}
				</Grid>
			</AccordionPanel>
		</AccordionItem>
	);
};

export default FormDivisionAccordion;
