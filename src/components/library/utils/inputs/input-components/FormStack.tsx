import { Field, Stack, StackProps, Text } from '@chakra-ui/react';
import { ReactNode, FC } from 'react';

type FormStackProps = StackProps & {
	children: ReactNode;
	label?: string;
	helper?: string;
	isRequired?: boolean;
};

const FONT_SIZE = '.85rem';
const FONT_WEIGHT = '600';
const M = 0;

const FormStack: FC<FormStackProps> = ({ children, label, isRequired, helper, ...props }) => {
	return (
		<Stack
			gap={4}
			{...props}>
			<Field.Root
				gap={2}
				w='full'
				required={isRequired}>
				{label && (
					<Field.Label
						color='text.formLabel.light'
						_dark={{ color: 'text.formLabel.dark' }}
						userSelect='none'
						m={M}
						fontSize={FONT_SIZE}
						fontWeight={FONT_WEIGHT}>
						{label} {isRequired && <Field.RequiredIndicator />}
					</Field.Label>
				)}
				{children}
				{helper && (
					<Field.HelperText
						color='#444'
						_dark={{ color: '#f5f5f5' }}
						px={1}
						fontStyle='italic'
						fontSize='.8rem'>
						{helper}
					</Field.HelperText>
				)}
			</Field.Root>
		</Stack>
	);
};

export default FormStack;
