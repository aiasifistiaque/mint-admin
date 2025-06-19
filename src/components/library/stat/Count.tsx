'use client';
import { FC } from 'react';
import { Skeleton, Tooltip } from '@chakra-ui/react';
import { useGetCountQuery, Align, Icon } from '..';
import { StatContainer, StatLabel, StatNumber } from './stat-components';

type CountProps = {
	title: string;
	path: string;
	filters?: any;
	tooltip?: string;
};

const Count: FC<CountProps> = ({ title, path, filters = {}, tooltip }) => {
	const { data, isFetching, isError } = useGetCountQuery({ path: path, filters }, { skip: !path });
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
				w='100px'>
				<StatNumber>{isError ? '--' : isFetching ? '--' : data}</StatNumber>
			</Skeleton>
		</StatContainer>
	);
};

export default Count;
