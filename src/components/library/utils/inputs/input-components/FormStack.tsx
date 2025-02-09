import { FormControlProps, Stack, StackProps, FormControl } from '@chakra-ui/react';
import React, { ReactNode, FC } from 'react';
import { Label, HelperText } from '../../..';

type FormStackProps = StackProps &
	FormControlProps & {
		children: ReactNode;
		label: string;
		helper?: string;
	};

const FormStack: FC<FormStackProps> = ({ children, label, helper, ...props }) => {
	return (
		<FormControl
			gap={4}
			{...props}>
			<Stack
				spacing={2}
				w='full'>
				<Label>{label}</Label>
				<Stack
					spacing={0}
					w='full'>
					{children}
					{helper && <HelperText>{helper}</HelperText>}
				</Stack>
			</Stack>
		</FormControl>
	);
};

export default FormStack;
