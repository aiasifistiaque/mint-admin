import React from 'react';
import { MenuButton as CustomButton, IconButton } from '@chakra-ui/react';
import { Icon, useIsMobile, radius } from '../../../../..';

const MenuButton = () => {
	const isMobile = useIsMobile();
	return (
		<CustomButton
			sx={isMobile ? { position: 'absolute', right: 2, top: 2 } : {}}
			as={IconButton}
			size={isMobile ? 'md' : 'sm'}
			borderWidth={1}
			borderRadius={radius?.BUTTON}
			_dark={{
				borderWidth: 0,
			}}
			_light={{
				borderColor: 'container.borderLight',
				bg: 'container.newLight',
			}}
			icon={
				<Icon
					name={isMobile ? 'dots' : 'settings'}
					size={isMobile ? 20 : 12}
				/>
			}
			colorScheme='gray'
		/>
	);
};

export default MenuButton;
