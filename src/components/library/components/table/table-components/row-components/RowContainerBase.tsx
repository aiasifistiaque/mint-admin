import { StackProps, Stack, Grid } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { radius, shadow, sizes } from '../../../..';

type RowContainerMobileProps = StackProps & {
	children: ReactNode;
};

const RowContainerBase: FC<RowContainerMobileProps> = ({ children, ...props }) => {
	return (
		<Grid
			gridTemplateColumns='1fr 1fr'
			position='relative'
			width='100%'
			borderRadius={radius.CONTAINER}
			mb={2}
			bg='table.row.light'
			borderWidth={1}
			borderColor='table.cardBorder.light'
			gap={4}
			p={4}
			pb={0}
			_last={{ mb: 4 }}
			_dark={{
				bg: 'table.row.dark',
				borderColor: 'table.cardBorder.dark',
			}}
			{...props}>
			{children}
		</Grid>
	);
};

export default RowContainerBase;
