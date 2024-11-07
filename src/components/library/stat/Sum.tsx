'use client';
import React, { FC } from 'react';
import { Skeleton, Tooltip } from '@chakra-ui/react';
import { Align, currency, Icon, useGetSumQuery } from '../';
import { StatContainer, StatLabel, StatNumber } from './stat-components';

type CountProps = {
	title: string;
	path: string;
	field: string;
	price?: boolean;
	filters?: any;
	tooltip?: string;
};

const Sum: FC<CountProps> = ({ title, path, field, price, tooltip, filters = {} }) => {
	const { data, isFetching, isError } = useGetSumQuery({ path, field, filters }, { skip: !path });
	return (
		<StatContainer>
			<Align>
				<StatLabel>{title}</StatLabel>
				{tooltip && (
					<Tooltip
						label={tooltip}
						borderRadius='md'>
						<span>
							<Icon name='info' />
						</span>
					</Tooltip>
				)}
			</Align>

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
