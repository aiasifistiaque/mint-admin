'use client';
import { FC, ReactNode } from 'react';
import { NativeSelect } from '@chakra-ui/react';
import { Icon } from '../../../..';
import { useColorMode } from '@/components/ui/color-mode';

type InputContainerProps = any & {
	children: ReactNode;
};

const RowSelect: FC<InputContainerProps> = ({ children, ...props }) => {
	const { colorMode } = useColorMode();
	const borderColor = colorMode === 'light' ? 'brand.500' : 'brand.200';

	return (
		<NativeSelect.Root
			size={{ base: 'md', md: 'sm' }}
			minW='100px'>
			<NativeSelect.Field
				borderRadius='lg'
				focusBorderColor={borderColor}
				color={colorMode === 'dark' ? 'gray.300' : 'text.500'}
				borderColor={colorMode === 'dark' ? 'selectBorder.dark' : 'selectBorder.light'}
				boxShadow='md'
				css={{
					'&::placeholder': {
						fontSize: '14px',
						fontWeight: '500',
					},
				}}
				{...props}>
				{children}
			</NativeSelect.Field>
			<NativeSelect.Indicator>
				<Icon name='select' />
			</NativeSelect.Indicator>
		</NativeSelect.Root>
	);
};

export default RowSelect;
