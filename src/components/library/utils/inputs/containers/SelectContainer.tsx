'use client';
import { FC, ReactNode } from 'react';
import { NativeSelect, NativeSelectFieldProps } from '@chakra-ui/react';
import { Icon, inputContainerCss } from '../../..';

type InputContainerProps = NativeSelectFieldProps & {
	children: ReactNode;
};

const SelectContainer: FC<InputContainerProps> = ({ children, ...props }) => {
	return (
		<NativeSelect.Root size='sm'>
			<NativeSelect.Field
				{...inputContainerCss}
				boxShadow='sm'
				{...props}>
				{children}
			</NativeSelect.Field>
			<NativeSelect.Indicator>
				<Icon name='select' />
			</NativeSelect.Indicator>
		</NativeSelect.Root>
	);
};

export default SelectContainer;
