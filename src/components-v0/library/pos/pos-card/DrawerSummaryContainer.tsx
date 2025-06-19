import React, { ReactNode } from 'react';
import { Column } from '@/components/library';
import { FlexProps } from '@chakra-ui/react';

const HEIGHT = 'calc(100vh - 52px - 52px)';

const DrawerSummaryContainer = ({ children, ...props }: FlexProps & { children: ReactNode }) => {
	return (
		<Column
			h={HEIGHT}
			bg='white'
			_dark={{ bg: 'background.dark' }}
			{...props}>
			{children}
		</Column>
	);
};

export default DrawerSummaryContainer;
