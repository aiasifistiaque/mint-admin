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
	href?: string;
};

const Count: FC<CountProps> = ({ title, path, filters = {}, tooltip, href }) => {
	const { data, isFetching, isError } = useGetCountQuery({ path: path, filters }, { skip: !path });
	return (
		<StatContainer href={href}>
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
