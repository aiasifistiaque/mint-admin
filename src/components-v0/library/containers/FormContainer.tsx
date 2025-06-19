import { ContainerProps, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';

type FormContainerProps = ContainerProps & {
	children: React.ReactNode;
};

const W_BASE = '100%';
const W_MD = '80%';
const W_LG = '70%';

const PADDING = 8;

const FormContainer: FC<FormContainerProps> = ({ children, ...props }) => {
	return (
		<Flex
			sx={styles.container}
			{...props}>
			{children}
		</Flex>
	);
};

const styles = {
	container: {
		h: 'fit-content',
		p: PADDING,
		bg: 'white',
		_dark: { bg: 'sidebar.dark' },
		flexDirection: 'column',
		mx: 'auto',
		borderRadius: 'lg',
		w: { base: W_BASE, md: W_MD, lg: W_LG },
		borderWidth: 2,
	},
};

export default FormContainer;
