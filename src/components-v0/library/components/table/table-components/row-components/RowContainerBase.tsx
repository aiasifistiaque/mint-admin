import { StackProps, Stack, Grid } from '@chakra-ui/react';
import React, { FC } from 'react';
import { radius, shadow, sizes } from '../../../..';

type RowContainerMobileProps = StackProps & {
	children: React.ReactNode;
};

const RowContainerBase: FC<RowContainerMobileProps> = ({ children, ...props }) => {
	return (
		<Grid
			gridTemplateColumns='1fr 1fr'
			position='relative'
			width='100%'
			borderRadius={radius.CONTAINER}
			//boxShadow={shadow.CARD}
			mb={2}
			bg='container.newLight'
			borderWidth={1}
			borderColor='container.borderLight'
			gap={4}
			p={4}
			pb={0}
			_last={{ mb: 4 }}
			// direction='column'
			_dark={{
				bg: 'menu.dark',
				borderColor: 'container.borderDark',
			}}
			{...props}>
			{children}
		</Grid>
	);
};

export default RowContainerBase;
