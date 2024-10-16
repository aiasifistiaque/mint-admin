import React, { FC } from 'react';
import { Skeleton } from '@chakra-ui/react';
import { useGetCountQuery } from '..';
import { StatContainer, StatLabel, StatNumber } from './stat-components';

type CountProps = {
	title: string;
	path: string;
	filters?: any;
};

const Count: FC<CountProps> = ({ title, path, filters = {} }) => {
	const { data, isFetching, isError } = useGetCountQuery({ path: path, filters }, { skip: !path });
	return (
		<StatContainer>
			<StatLabel>{title}</StatLabel>
			<Skeleton
				isLoaded={!isFetching}
				w='100px'>
				<StatNumber>{isError ? '--' : isFetching ? '--' : data}</StatNumber>
			</Skeleton>
		</StatContainer>
	);
};

export default Count;
