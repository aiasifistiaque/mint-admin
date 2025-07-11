import { FC } from 'react';
import { Skeleton, Tooltip } from '@chakra-ui/react';
import { currency, Align, Icon } from '..';
import { StatContainer, StatLabel, StatNumber } from './stat-components';

type CountProps = {
	title: string;
	children: any;
	price?: boolean;
	isLoading?: boolean;
	isError?: boolean;
	tooltip?: string;
	href?: string;
};

const ShowSum: FC<CountProps> = ({
	title,
	children,
	price,
	tooltip,
	isLoading = false,
	isError = false,
	href,
}) => {
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
