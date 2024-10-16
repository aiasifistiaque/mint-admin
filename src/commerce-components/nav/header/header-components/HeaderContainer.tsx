import { GridChild, padding, sizes } from '../../..';
import { Grid } from '@chakra-ui/react';
import React, { FC } from 'react';

const HeaderContainer: FC<GridChild> = ({ children, ...props }) => {
	return (
		<Grid
			zIndex='999'
			bg='white'
			_dark={{ bg: 'eblack.200' }}
			position='fixed'
			left={0}
			top={0}
			px={padding.LAYOUT_X}
			alignItems='center'
			w='100%'
			gridTemplateColumns='1fr 1fr 1fr'
			borderBottom='1px solid'
			borderBottomColor='eborder.600'
			h={{ base: sizes.NAVBAR_HEIGHT_BASE, md: sizes.NAVBAR_HEIGHT }}
			{...props}>
			{children}
		</Grid>
	);
};

export default HeaderContainer;
