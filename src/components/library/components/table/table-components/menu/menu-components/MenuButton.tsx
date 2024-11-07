import React from 'react';
import { MenuButton as CustomButton, IconButton } from '@chakra-ui/react';
import { Icon, useIsMobile } from '../../../../../';

const MenuButton = () => {
	const isMobile = useIsMobile();
	return (
		<CustomButton
			sx={isMobile ? { position: 'absolute', right: 2, top: 2 } : {}}
			as={IconButton}
			size={isMobile ? 'md' : 'sm'}
			icon={
				<Icon
					name={isMobile ? 'dots' : 'settings'}
					size={isMobile ? 20 : 12}
				/>
			}
			variant='ghost'
		/>
	);
};

export default MenuButton;
