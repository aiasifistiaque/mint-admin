import { StackProps, Stack, Grid } from '@chakra-ui/react';
import React, { FC } from 'react';
import { shadow, sizes } from '../../../../';

type RowContainerMobileProps = StackProps & {
	children: React.ReactNode;
};

const RowContainerBase: FC<RowContainerMobileProps> = ({ children, ...props }) => {
	return (
		<Grid
			gridTemplateColumns='1fr 1fr'
			position='relative'
			width='100%'
			borderRadius={sizes.CARD_RADIUS}
			boxShadow={shadow.CARD}
			mb={3}
			bg='white'
			gap={4}
			p={4}
			pb={2}
			_last={{ mb: 12 }}
			// direction='column'
			_dark={{
				bg: 'menu.dark',
			}}
			{...props}>
			{children}
		</Grid>
	);
};

export default RowContainerBase;
