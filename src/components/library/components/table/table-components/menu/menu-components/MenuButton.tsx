import { Menu, IconButton } from '@chakra-ui/react';
import { Icon, useIsMobile, radius } from '../../../../..';

const MenuButton = ({ ...props }: any) => {
	const isMobile = useIsMobile();

	return (
		// <Menu.Trigger
		//
		// 	asChild>
		<IconButton
			css={isMobile ? { position: 'absolute', right: 2, top: 2 } : {}}
			size={isMobile ? 'md' : 'xs'}
			borderWidth={1}
			borderRadius={radius?.BUTTON}
			borderColor='border.light'
			bg='container.newLight'
			_dark={{
				color: 'white',
				bg: 'background.dark',
				borderColor: 'border.dark',
			}}
			colorPalette='gray'
			{...props}>
			<Icon
				name={isMobile ? 'dots' : 'dots'}
				size={isMobile ? 20 : 16}
			/>
		</IconButton>
		// </Menu.Trigger>
	);
};

export default MenuButton;
