import React, { FC } from 'react';
import { Skeleton } from '@chakra-ui/react';
import { currency, useGetSumQuery } from '..';
import { StatContainer, StatLabel, StatNumber } from './stat-components';

type CountProps = {
	title: string;
	path: string;
	field: string;
	price?: boolean;
	filters?: any;
};

const Sum: FC<CountProps> = ({ title, path, field, price, filters = {} }) => {
	const { data, isFetching, isError } = useGetSumQuery({ path, field, filters }, { skip: !path });
	return (
		<StatContainer>
			<StatLabel>{title}</StatLabel>

			<Skeleton
				isLoaded={!isFetching}
				w={!isFetching ? '100%' : '100px'}>
				<StatNumber>
					{isError
						? '--'
						: isFetching
						? '--'
						: price
						? `${currency.symbol}${data?.total.toLocaleString()}`
						: data?.total}
				</StatNumber>
			</Skeleton>
		</StatContainer>
	);
};

export default Sum;
