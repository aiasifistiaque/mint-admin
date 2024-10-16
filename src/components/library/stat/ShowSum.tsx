import React, { FC } from 'react';
import { Skeleton } from '@chakra-ui/react';
import { currency } from '..';
import { StatContainer, StatLabel, StatNumber } from './stat-components';

type CountProps = {
	title: string;
	children: string | number;
	price?: boolean;
	isLoading?: boolean;
	isError?: boolean;
};

const ShowSum: FC<CountProps> = ({
	title,
	children,
	price,
	isLoading = false,
	isError = false,
}) => {
	return (
		<StatContainer>
			<StatLabel>{title}</StatLabel>

			<Skeleton
				isLoaded={!isLoading}
				w={!isLoading ? '100%' : '100px'}>
				<StatNumber>
					{isError
						? '--'
						: isLoading
						? '--'
						: price
						? `${currency.symbol}${children.toLocaleString()}`
						: children}
				</StatNumber>
			</Skeleton>
		</StatContainer>
	);
};

export default ShowSum;
