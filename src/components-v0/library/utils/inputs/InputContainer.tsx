import { Grid, Flex, FlexProps, FormControl, FormHelperText } from '@chakra-ui/react';
import React from 'react';

import { Label, Column } from '../..';

type InputContainerProps = FlexProps & {
	children: React.ReactNode;
	label?: string;
	isRequired?: boolean;
	helper?: string;
};

const InputContainer: React.FC<InputContainerProps> = ({
	children,
	label,
	isRequired,
	helper,
	...props
}) => {
	return (
		<FormControl
			as={Grid}
			isRequired={isRequired}
			sx={styles.container}>
			{label && (
				<Flex align='center'>
					<Label>{label}</Label>
				</Flex>
			)}
			<Column>
				{children}
				{helper && <FormHelperText sx={styles.helper}>{helper}</FormHelperText>}
			</Column>
		</FormControl>
	);
};

export default InputContainer;

const styles = {
	container: {
		gridTemplateColumns: '1fr 5fr',
		gap: 1,
		_notLast: {
			borderBottomWidth: 1,
			borderColor: 'border.light',
			_dark: { borderColor: 'border.dark' },
		},
		py: 4,
		_last: { pb: 0 },
		_first: { pt: 0 },
	},
	label: {
		m: 0,
		fontWeight: '700',
	},
	helper: {
		fontSize: '.8rem',
		px: 3,
		color: 'gray.400',
	},
};
