import { StatProps, Stat } from '@chakra-ui/react';
import React from 'react';
import { shadow, radius } from '../..';

const StatContainer = ({ children, ...props }: StatProps & { children: React.ReactNode }) => {
	return (
		<Stat
			borderRadius={radius.CONTAINER}
			alignItems='center'
			w='full'
			p={4}
			bg='container.newLight'
			borderColor='container.borderLight'
			borderWidth={1}
			boxShadow={shadow?.DASH}
			_dark={{
				bg: 'menu.dark',
				borderColor: 'container.borderDark',
			}}>
			{children}
		</Stat>
	);
};

export default StatContainer;
