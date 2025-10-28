import { Menu, IconButton } from '@chakra-ui/react';
import { Icon, useIsMobile, radius } from '../../../../..';

const MenuButton = () => {
	const isMobile = useIsMobile();

	return (
		<Menu.Trigger
			css={isMobile ? { position: 'absolute', right: 2, top: 2 } : {}}
			asChild>
			<IconButton
				size={isMobile ? 'md' : 'sm'}
				borderWidth={1}
				borderRadius={radius?.BUTTON}
				borderColor='border.dark'
				bg='container.newLight'
				_dark={{
					color: 'white',
					bg: 'container.dark',
					borderColor: 'container.borderDark',
				}}
				colorPalette='gray'>
				<Icon
					name={isMobile ? 'dots' : 'config'}
					size={isMobile ? 20 : 16}
				/>
			</IconButton>
		</Menu.Trigger>
	);
};

export default MenuButton;
