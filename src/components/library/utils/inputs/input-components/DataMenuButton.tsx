import { FC } from 'react';
import { Menu, Button } from '@chakra-ui/react';
import { useColorMode } from '@/components/ui/color-mode';
import { sizes, shadow, Icon } from '../../..';

type DataMenuButtonProps = {
	value: string;
	isActive?: boolean;
	children: any;
	isFont?: boolean;
	[key: string]: any;
};

const DataMenuButton: FC<DataMenuButtonProps> = ({
	children,
	value,
	isActive,
	isFont,
	...props
}) => {
	const { colorMode } = useColorMode();

	return (
		<Menu.Trigger asChild>
			<Button
				variant='outline'
				colorPalette='gray'
				boxShadow='none'
				borderRadius={sizes.RADIUS_MENU}
				cursor='default'
				h='32px'
				textAlign='left'
				size='sm'
				fontSize='.9rem'
				pl={3}
				pr={2}
				borderColor={colorMode === 'light' ? 'selectBorder.light' : 'selectBorder.dark'}
				color={value ? 'text.500' : colorMode === 'light' ? 'gray.300' : 'gray.300'}
				{...(!isFont && { fontWeight: value ? '400' : '500' })}
				{...props}>
				{children}
				<Icon
					name='select'
					size={20}
				/>
			</Button>
		</Menu.Trigger>
	);
};

export default DataMenuButton;
